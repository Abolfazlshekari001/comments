import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { InternalServerError, Unauthorized } from '../translate/Error.Translate';

@Injectable()
export class GatewayGuard implements CanActivate {
  private readonly logger = new Logger(GatewayGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientId = request.headers['clientid'] || request.headers['clientId'];
    const apiKey = request.headers['apikey'] || request.headers['apiKey'];
     if (!clientId || !apiKey) {
      this.logger.warn('Missing clientId or apiKey in request headers.');
      const missingCredentialsErr = Unauthorized(
        'مقدار clientId یا apiKey در هدر درخواست موجود نیست.',
        'Missing credentials in request headers.'
      );
      throw new HttpException(missingCredentialsErr, missingCredentialsErr.status_code);
    }
    const payload = {
      clientId,
      apiKey
    };
    try {
      const response = await axios.post(process.env.GETWAY_VALIDATE, payload);
      if (response.data.success === true) {
        this.logger.debug('Access validated successfully with Gateway.');
        return true;
      }
      this.logger.warn('Access denied by Gateway validation.');
      const unauthorizedErr = Unauthorized('دسترسی با Gateway تأیید نشد', 'Could not validate access with Gateway');
      throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
    } catch (error) {
      this.logger.error('Error communicating with Gateway:', error.message);
      if (error.response?.data) {
        throw new HttpException(error.response.data.result, error.response.data.result.status_code);
    } else if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
    } else throw error;
    }
  }
}

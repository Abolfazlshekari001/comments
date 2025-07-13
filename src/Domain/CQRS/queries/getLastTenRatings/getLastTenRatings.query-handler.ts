import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Unauthorized, InternalServerError } from 'src/Common/translate/Error.Translate';
import { CommentService } from 'src/Domain/Comment.service';
import { getLastTenRatingsQuery } from './getLastTenRatings.query';

@QueryHandler(getLastTenRatingsQuery)
export class getLastTenRatingsQueryHandler implements IQueryHandler<getLastTenRatingsQuery> {
  constructor(
    private readonly commentService: CommentService,
  ) {}
  async execute(query: getLastTenRatingsQuery): Promise<any> {
    const { system_name, system_password, section } = query;
    try {
      const existingSystem = await this.commentService.findSystem(system_name, system_password);
      if (existingSystem) {
          const findRate = await this.commentService.getLastTenComments(section, existingSystem.id);
        if (!findRate) {
          return [];
        }
        return findRate;
      } else {
        const unauthorizedErr = Unauthorized('سیستم نامعتبر است', 'The system is invalid');
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}

import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Unauthorized,
  InternalServerError,
  Invalid_Input,
  Data_Field_Is_Duplicate,
} from 'src/Common/translate/Error.Translate';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { Repository } from 'typeorm';
import { addSystemCommand } from './add-system.command';
import { Request_Was_Successful, Request_Was_Successful1 } from 'src/Common/translate/successful.Translate';

@CommandHandler(addSystemCommand)
export class addSystemCommandHandler
  implements ICommandHandler<addSystemCommand>
{
  constructor(
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) {}
  async execute(command: addSystemCommand): Promise<any> {
    const { hasRatingOption, system_name, system_password } = command.body;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (!existingSystem) {
        const system = new systemEntity();
        system.systemName = system_name;
        system.systemPassword = system_password;
        system.hasRatingOption = hasRatingOption;
        await this.systemRepository.save(system);
         let systemId = system.id
        const additional_info = {system};
        const result = Request_Was_Successful1(additional_info);
        throw new HttpException({ ...result }, result.status_code);
      } else {
        throw new HttpException(Data_Field_Is_Duplicate, Data_Field_Is_Duplicate.status_code);
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }
}

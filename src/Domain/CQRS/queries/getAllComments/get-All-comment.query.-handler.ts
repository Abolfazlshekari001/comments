import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { GetAllCommentQuery } from './get-All-comment.query';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';

@QueryHandler(GetAllCommentQuery)
export class GetAllCommentQueryHandler
  implements IQueryHandler<GetAllCommentQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) { }

  async execute(query: GetAllCommentQuery): Promise<any> {
    try {
      const { system_name, system_password, section } = query;
      const { postId } = query;
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem) {
        const result = await this.commentRepository
          .createQueryBuilder('comments')
          .leftJoinAndSelect('comments.mapComment', 'mapComment')
          .leftJoinAndSelect(
            'mapComment.replys',
            'replys',
            'mapComment.replyId = replys.id',
          )
          .andWhere('comments.section = :section', { section })
          .andWhere('comments.postId = :postId', { postId })
          .andWhere('comments.condition = :condition', { condition: ConditionEnum.Approved })
          .orderBy('comments.created_at', 'DESC')
          .getMany();
        if (result.length != 0) {
          return result;
        } else {
          return []
        }
      } else {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
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

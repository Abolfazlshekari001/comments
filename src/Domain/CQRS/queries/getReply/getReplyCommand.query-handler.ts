import { InjectRepository } from '@nestjs/typeorm';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { Repository } from 'typeorm';
import { GetReplyQuery } from './getReplyCommand.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { mapCommentEntity } from 'src/Domain/entities/mapComment.entity';

@QueryHandler(GetReplyQuery)
export class GetReplyQueryHandler implements IQueryHandler<GetReplyQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    @InjectRepository(mapCommentEntity)
    private readonly replyComments: Repository<mapCommentEntity>,
  ) {}
  async execute(query: GetReplyQuery): Promise<any> {
    try {
      const { system_name, system_password } = query.req;
      const { postId, commentId,section } = query;
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
          .where(
            'mapComment.commentId = :commentId AND mapComment.deletedAt IS NULL AND comments.postId = :postId',
            { commentId, postId }, 
          )
          .andWhere('comments.section = :section', { section }) 
          .orderBy('comments.created_at', 'DESC')
          .getMany();
        if (result.length == 0) {
          return [];
        } else {
          return result;
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

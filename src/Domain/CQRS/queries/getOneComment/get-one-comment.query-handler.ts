import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { GetOneCommentQuery } from './get-one-comment.query';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { CommentService } from 'src/Domain/Comment.service';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';

@QueryHandler(GetOneCommentQuery)
export class GetOneCommentQueryHandler
  implements IQueryHandler<GetOneCommentQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    private readonly commentService: CommentService,
  ) { }
  async execute(query: GetOneCommentQuery): Promise<any> {
    const { system_name, system_password, section } = query.req;
    const { commentId, postId } = query;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem) {
        let findComment = await this.commentService.GetPostAndComment(
          commentId,
          postId,
          section,
        );
        if (
          findComment &&
          findComment.deletedAt === null &&
          findComment.condition === ConditionEnum.Approved
        ) {
          return findComment;
        } else {
          return [];
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

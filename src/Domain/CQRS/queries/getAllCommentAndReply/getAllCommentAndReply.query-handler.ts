import { InjectRepository } from '@nestjs/typeorm';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { Repository } from 'typeorm';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';
import { InternalServerError, NoContent, Unauthorized } from 'src/Common/translate/Error.Translate';
import { mapCommentEntity } from 'src/Domain/entities/mapComment.entity';
import { AllCommentAndGetReplyQuery } from './getAllCommentAndReply.query';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';

@QueryHandler(AllCommentAndGetReplyQuery)
export class AllCommentAndGetReplyQueryHandler implements IQueryHandler<AllCommentAndGetReplyQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    @InjectRepository(mapCommentEntity)
    private readonly replyComments: Repository<mapCommentEntity>,
  ) { }
  async execute(query: AllCommentAndGetReplyQuery): Promise<any> {
    try {
      const { system_name, system_password } = query.req;
      const { section } = query;
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
          .leftJoin('comments.mapReplys', 'mapReply')
          .leftJoinAndSelect('mapComment.replys', 'replys')
          .andWhere('comments.section = :section', { section })
          .andWhere('mapReply.replyId IS NULL')
          .orderBy('comments.created_at', 'DESC')
          .getMany();
        if (result.length == 0) {
          return []
        } else {
          const processedResults = (result as any[]).map((comment) => ({
            ...comment,
            mapComment: comment.mapComment.map((mapComment) => ({
              ...mapComment,
              replys: { commentText: mapComment.replys.commentText, id: mapComment.replys.id },
            })),
          }));
          return processedResults;
        }
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

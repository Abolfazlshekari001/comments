import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerError, NoContent, Unauthorized } from 'src/Common/translate/Error.Translate';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { GetUserCommentQuery } from './getUser-comment.qusey';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';
@QueryHandler(GetUserCommentQuery)
export class GetUserCommentQueryHandler implements IQueryHandler<GetUserCommentQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) {}
  async execute(query: GetUserCommentQuery): Promise<any> {
    const { system_name, system_password, section } = query;
    const { userId } = query;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      let { limit, offset } = query.req.query;
      limit = limit ? limit : 100;
      offset = offset ? offset : 0;
      if (existingSystem) {
        const findPost = await this.commentRepository.find({
          where: {
            section: section,
          },
          order: { created_at: 'DESC' },
        });
        if (!findPost) {
          return []
        }
        const commentsFound = await this.commentRepository.find({
          take: limit,
          skip: offset,
          where: {
            userId: userId,
            section: section,
            deletedAt: IsNull(),
          },
          order: { created_at: 'DESC' },
        });
        if (commentsFound.length > 0) {
          return commentsFound;
        } else {
          return [];
        }
      } else {
        const unauthorizedErr = Unauthorized('سیستم نامعتبر است', 'The system is invalid');
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
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

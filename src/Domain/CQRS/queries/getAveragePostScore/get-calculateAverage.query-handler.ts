import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { systemEntity } from 'src/Domain/entities/system.entity';
import {
  Between,
  Repository,
} from 'typeorm';
import { GetPostRatingsAverageQuery } from './get-calculateAverage.query';
import {
  DataNotFound2,
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { HttpException } from '@nestjs/common';

@QueryHandler(GetPostRatingsAverageQuery)
export class GetPostRatingsAverageQueryHandler
  implements IQueryHandler<GetPostRatingsAverageQuery>
{
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) {}
  async execute(query: GetPostRatingsAverageQuery): Promise<any> {
    const { system_name, system_password, section } = query.req;
    const { postIds } = query;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem) {
        const today = new Date();
        const oneMonthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate(),
        );

        const postIdss = postIds.split(',');
        const results = [];
        for (const postId of postIdss) {
          const posts = await this.commentRepository.find({
            where: {
              postId: postId.trim(),
              section: section,
              created_at: Between(oneMonthAgo, today),
            },
            order: {
              created_at: 'DESC',
            },
            take: 100,
          });

          if (posts.length > 0) {
            const totalRating = posts.reduce(
              (acc, curr) => acc + curr.rating,
              0,
            );
            const averageRating = totalRating / posts.length;
            results.push({ postId, averageRating });
          } else {
            throw new HttpException(DataNotFound2, DataNotFound2.status_code);
          }
        }

        if (results.length > 0) {
          return results;
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

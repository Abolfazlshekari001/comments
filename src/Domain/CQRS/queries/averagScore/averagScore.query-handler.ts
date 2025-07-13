import { HttpException } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Unauthorized, InternalServerError } from "src/Common/translate/Error.Translate";
import { commentEntity } from "src/Domain/entities/comment.entity";
import { systemEntity } from "src/Domain/entities/system.entity";
import { Repository } from "typeorm";
import { GetRatingAverageQuery } from "./averagScore.query";

@QueryHandler(GetRatingAverageQuery)
export class GetRatingAverageQueryHandler
  implements IQueryHandler<GetRatingAverageQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) { }
  async execute(query: GetRatingAverageQuery): Promise<any> {
    const { system_name, system_password, section } = query.req;
    const { postId } = query;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (!existingSystem) {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
      const comments = await this.commentRepository.find({
        where: {
          postId,
          section
        },
      });
      if (comments.length === 0) {
        return { message: 'No ratings found for this post', average: null };
      }
      const totalRatings = comments.reduce(
        (sum, comment) => sum + (comment.rating || 0),
        0,
      );
      const averageRating = totalRatings / comments.length;

      return { average: averageRating };

    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }

  }
}

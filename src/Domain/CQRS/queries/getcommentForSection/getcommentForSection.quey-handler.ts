import { HttpException } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { NoContent, Unauthorized, InternalServerError } from "src/Common/translate/Error.Translate";
import { CommentService } from "src/Domain/Comment.service";
import { commentEntity } from "src/Domain/entities/comment.entity";
import { systemEntity } from "src/Domain/entities/system.entity";
import { Repository } from "typeorm";
import { GetcommentForSectionQuery } from "./getcommentForSection.quey";

@QueryHandler(GetcommentForSectionQuery)
export class GetcommentForSectionQueryHandler
  implements IQueryHandler<GetcommentForSectionQuery> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    private readonly commentService: CommentService,
  ) { }
  async execute(query: GetcommentForSectionQuery): Promise<any> {
    const { system_name, system_password, section } = query;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem) {
        let findComment = await this.commentService.getAllCommentSection(
          section,
        );
        if (
          !findComment
        ) {
          return [];
        }
        return findComment
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
import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Unauthorized, InternalServerError } from 'src/Common/translate/Error.Translate';
import { GetUserCommentsInSystemQuery } from './getAllCommentUserToToosFood.query';
import { CommentService } from 'src/Domain/Comment.service';

@QueryHandler(GetUserCommentsInSystemQuery)
export class GetUserCommentsInSystemQueryHandler implements IQueryHandler<GetUserCommentsInSystemQuery> {
  constructor(private readonly commentService: CommentService) {}
  async execute(query: GetUserCommentsInSystemQuery): Promise<any> {
    const { system_name, system_password } = query;
    const { userId } = query;
    try {
      const existingSystem = await this.commentService.findSystem(system_name, system_password);
      let { limit, offset } = query.req.query;
      limit = limit ? limit : 10;
      offset = offset ? offset : 0;
      if (existingSystem) {
        const result = await this.commentService.getAllCommentInSystem(userId, existingSystem.id, limit, offset);

        if (result.length > 0) {
          const processedResults = result.map((comment) => ({
            ...comment,
            mapComment: comment.mapComment.map((mapComment) => ({
              replys: mapComment.replys
                ? { commentText: mapComment.replys.commentText, id: mapComment.replys.id }
                : null, 
            })),
          }));
          return processedResults;
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

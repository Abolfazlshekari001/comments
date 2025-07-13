import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { updateCommentCommand } from './updateComment.command';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import {
  Request_Was_Successful1,
} from 'src/Common/translate/successful.Translate';
import {
  Bad_Request_Exception,
  DataNotFound2,
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { CommentService } from 'src/Domain/Comment.service';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';

@CommandHandler(updateCommentCommand)
export class updateCommentCommandHandler
  implements ICommandHandler<updateCommentCommand> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    private readonly commentService: CommentService,
  ) { }
  async execute(command: updateCommentCommand): Promise<any> {
    const { comment_text, system_name, system_password, section, rating } =
      command.req;
    const { commentId, postId } = command;

    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });

      if (existingSystem) {
        if (existingSystem.hasRatingOption === true && rating == undefined) {
          const BadRequestErr = Bad_Request_Exception(
            'دادن امتیاز الزامی هست',
            'Rating is mandatory',
          );
          throw new HttpException(BadRequestErr, BadRequestErr.status_code);
        } else {
          let findComment = await this.commentService.GetPostAndComment(
            commentId,
            postId,
            section,
          );
          if (
            findComment &&
            findComment.deletedAt === null &&
            findComment.condition != ConditionEnum.Approved
          ) {
            if (findComment.countUpdate < 4) {
              findComment.commentText = comment_text;
              findComment.countUpdate++;
              if (rating !== undefined) {
                findComment.rating = rating;
              }

              await this.commentRepository.save(findComment);
              let commentId = findComment.id;
              let PostId = findComment.postId;
              let rate = findComment.rating;
              const additional_info = {
                comment_Id: commentId,
                post_Id: PostId,
                rate: rate,
              };
              const result = Request_Was_Successful1(additional_info);
              throw new HttpException({ ...result }, result.status_code);
            } else {
              const NoContenttErr = NoContent(
                'درخواست حاوی پاسخ نمیباشد',
                'The response is empty '
              );
              throw new HttpException(NoContenttErr, NoContenttErr.status_code);
            }
          } else {
            throw new HttpException(DataNotFound2, DataNotFound2.status_code);
          }
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
      } else {
        throw error;
      }
    }
  }
}

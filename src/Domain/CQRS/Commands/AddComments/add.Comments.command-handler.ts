import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { commentEntity } from '../../../entities/comment.entity';
import { addCommentCommand } from './add.Comment.command';
import { Request_Was_Successful3 } from 'src/Common/translate/successful.Translate';
import {
  Bad_Request_Exception,
  InternalServerError,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { systemEntity } from 'src/Domain/entities/system.entity';
@CommandHandler(addCommentCommand)
export class addCommentCommandHandler
  implements ICommandHandler<addCommentCommand> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) { }
  async execute(command: addCommentCommand): Promise<any> {
    const {
      name,
      system_name,
      system_password,
      userId,
      section,
      comments
    } = command.body;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem != null) {
        for (const comment of comments) {
          if (existingSystem.hasRatingOption === true && comment.rating === undefined) {
            const BadRequestErr = Bad_Request_Exception(
              'دادن امتیاز الزامی هست',
              'Rating is mandatory for each comment',
            );
            throw new HttpException(BadRequestErr, BadRequestErr.status_code);
          }
          const savedCommentsInfo = [];
          for (const comment of comments) {
            const newComment = new commentEntity();
            newComment.name = name;
            newComment.system = existingSystem;
            newComment.commentText = comment.comment_text;
            newComment.postId = comment.postId;
            if (comment.rating !== undefined) {
              newComment.rating = comment.rating;
            }
            newComment.section = section;
            if (userId !== undefined) {
              newComment.userId = userId;
            }
            newComment.created_at = new Date();
            const savedComment = await this.commentRepository.save(newComment);
            savedCommentsInfo.push(
              savedComment
            );
          }
          const result = Request_Was_Successful3(savedCommentsInfo);
          throw new HttpException(
            {
              ...result,
            },
            result.status_code,
          );
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

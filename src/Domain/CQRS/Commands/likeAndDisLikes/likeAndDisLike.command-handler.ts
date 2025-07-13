import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { likeAndDisLikeCommentCommand } from './likeAndDisLike.command';
import { InjectRepository } from '@nestjs/typeorm';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { Repository } from 'typeorm';
import { likeAndDisLikeEntiy } from 'src/Domain/entities/likeAndDisLike.entity';
import { CommentService } from 'src/Domain/Comment.service';
import { HttpException } from '@nestjs/common';
import {
  DataNotFound2,
  InternalServerError,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import {
  Request_Was_Successful,
  Request_Was_Successful4,
} from 'src/Common/translate/successful.Translate';
import { LikeAndDisLikeStatusEnum } from 'src/Domain/entities/enums/like.enum';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';

@CommandHandler(likeAndDisLikeCommentCommand)
export class likeAndDisLikeCommentCommandHandler
  implements ICommandHandler<likeAndDisLikeCommentCommand>
{
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    @InjectRepository(likeAndDisLikeEntiy)
    private readonly likeDislikeRepository: Repository<likeAndDisLikeEntiy>,
    private readonly commentService: CommentService,
  ) {}
  async execute(command: likeAndDisLikeCommentCommand): Promise<any> {
    const { system_name, system_password, dislike, like, section } = command;
    const user = command.userId;
    const { commentId, postId } = command;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem) {
        const existingComment = await this.commentRepository.findOne({
          where: {
            id: commentId,
            postId: postId,
            section: section,
            condition : ConditionEnum.Approved
          },
        });
        if (existingComment) {
          const existingLikeDislike = await this.likeDislikeRepository.findOne({
            where: {
              comment: { id: commentId },
              userId: user,
            },
          });
          if (existingLikeDislike) {
            if (
              like &&
              existingLikeDislike.RectionUser === LikeAndDisLikeStatusEnum.LIKE
            ) {
              await this.likeDislikeRepository.remove(existingLikeDislike);
              existingComment.likes--;
              await this.commentRepository.save(existingComment);
              return 'Like removed';
            }
            if (
              dislike &&
              existingLikeDislike.RectionUser ===
                LikeAndDisLikeStatusEnum.DISLIKE
            ) {
              await this.likeDislikeRepository.remove(existingLikeDislike);
              existingComment.dislike--;
              await this.commentRepository.save(existingComment);
              return 'Dislike removed';
            }
            if (
              existingLikeDislike.RectionUser ===
                LikeAndDisLikeStatusEnum.LIKE &&
              dislike
            ) {
              existingLikeDislike.RectionUser =
                LikeAndDisLikeStatusEnum.DISLIKE;
              existingComment.likes--;
              existingComment.dislike++;
            }
            else if (
              existingLikeDislike.RectionUser ===
                LikeAndDisLikeStatusEnum.DISLIKE &&
              like
            ) {
              existingLikeDislike.RectionUser = LikeAndDisLikeStatusEnum.LIKE;
              existingComment.dislike--;
              existingComment.likes++;
            }
            await this.likeDislikeRepository.save(existingLikeDislike);
            await this.commentRepository.save(existingComment);
            throw new HttpException(
              Request_Was_Successful,
              Request_Was_Successful.status_code,
            );
          } else {
            const newLikeDislike = new likeAndDisLikeEntiy();
            newLikeDislike.comment = commentId;
            newLikeDislike.userId = user;
            if (like !== undefined) {
              newLikeDislike.RectionUser = LikeAndDisLikeStatusEnum.LIKE;
              existingComment.likes++;
            } else if (dislike !== undefined) {
              newLikeDislike.RectionUser = LikeAndDisLikeStatusEnum.DISLIKE;
              existingComment.dislike++;
            }
            await this.likeDislikeRepository.save(newLikeDislike);
            await this.commentRepository.save(existingComment);
            throw new HttpException(
              Request_Was_Successful,
              Request_Was_Successful.status_code,
            );
          }
        } else {
          throw new HttpException(DataNotFound2, DataNotFound2.status_code);
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

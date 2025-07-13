import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { replyCommentCommand } from './reply.command';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Connection, IsNull, Repository } from 'typeorm';

import { mapCommentEntity } from 'src/Domain/entities/mapComment.entity';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import {
  DataNotFound2,
  InternalServerError,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { CommentService } from 'src/Domain/Comment.service';
import { ConditionEnum } from 'src/Domain/entities/enums/condition.enum';

@CommandHandler(replyCommentCommand)
export class replyCommentCommandhandler
  implements ICommandHandler<replyCommentCommand> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(mapCommentEntity)
    private readonly replyComments: Repository<mapCommentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    private readonly connection: Connection,
    private readonly commentService: CommentService,
  ) { }
  async execute(command: replyCommentCommand): Promise<any> {
    const {
      name,
      comment_text,
      system_name,
      system_password,
      userId,
      section,
    } = command.req;
    const { commentId, postId } = command;
    let replyId;
    let savedReply
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
            deletedAt: IsNull(),
            condition: ConditionEnum.Approved
          },
        });
        const relatedMaps = await this.replyComments.findOne({
          where: { replys: { id: commentId } },
        });
        if (existingComment && !relatedMaps) {
          const queryRunner = this.connection.createQueryRunner();
          await queryRunner.connect();
          await queryRunner.startTransaction();
          try {
            let reply = new commentEntity();
            reply.name = name;
            reply.commentText = comment_text;
            reply.section = section;
            reply.system = existingSystem;
            if (userId !== undefined) {
              reply.userId = userId;
            }
            savedReply = await queryRunner.manager.save(reply);
            let maps = new mapCommentEntity();

            maps.comments = existingComment;
            maps.replys = savedReply;
            await queryRunner.manager.save(maps);
            replyId = reply.id;
            existingComment.numberReplays++;
            await this.commentRepository.save(existingComment);
            await queryRunner.commitTransaction();
          } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
          } finally {
            await queryRunner.release();
          }
          const result = {
            id: existingComment.id,
            userId: existingComment.userId,
            name: existingComment.name,
            commentText: existingComment.commentText,
            condition: existingComment.condition,
            likes: existingComment.likes,
            dislike: existingComment.dislike,
            countUpdate: existingComment.countUpdate,
            numberReplays: existingComment.numberReplays,
            section: existingComment.section,
            rating: existingComment.rating,
            postId: existingComment.postId,
            deletedAt: existingComment.deletedAt,
            created_at: existingComment.created_at,
            updated_at: existingComment.updated_at,
            mapComment: [
              {
                replys: {
                  commentText: savedReply.commentText,
                },
              },
            ],
          };

          return result;
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

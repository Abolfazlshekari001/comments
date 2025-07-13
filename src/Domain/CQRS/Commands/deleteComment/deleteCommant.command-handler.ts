import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { deleteCommentCommand } from './deleteCmment.command';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import * as moment from 'moment';
import {
  DataNotFound2,
  InternalServerError,
  TheDataHasAlreadyBeenDeleted,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { Request_Was_Successful } from 'src/Common/translate/successful.Translate';
import { CommentService } from 'src/Domain/Comment.service';
import { mapCommentEntity } from 'src/Domain/entities/mapComment.entity';
import { systemEntity } from 'src/Domain/entities/system.entity';

@CommandHandler(deleteCommentCommand)
export class deleteCommentCommandHandler
  implements ICommandHandler<deleteCommentCommand> {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    private readonly commentService: CommentService,
    @InjectRepository(mapCommentEntity)
    private readonly replyComments: Repository<mapCommentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
    private readonly connection: Connection,
  ) { }
  async execute(command: deleteCommentCommand): Promise<any> {
    const { commentId, postId, section, system_name, system_password, userId } =
      command;
    try {
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      if (existingSystem) {
        let findComment = await this.commentRepository.findOne({
          where: {
            id: commentId,
            postId: postId,
            section: section,
            userId: userId,
          },
        });
        if (findComment) {
          const relatedMaps = await this.replyComments.find({
            where: { comments: { id: commentId } },
          });
          if (!relatedMaps) {
            findComment.deletedAt = moment().format();
            await this.commentRepository.save(findComment);
            throw new HttpException(
              Request_Was_Successful,
              Request_Was_Successful.status_code,
            );
          } else {
            if (findComment && findComment.deletedAt === null) {
              const queryRunner = this.connection.createQueryRunner();
              await queryRunner.connect();
              await queryRunner.startTransaction();

              try {
                findComment.deletedAt = moment().format();
                await queryRunner.manager.save(findComment);

                for (const map of relatedMaps) {
                  map.deletedAt = moment().format();
                  await queryRunner.manager.save(map);
                }

                await queryRunner.commitTransaction();
              } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
              } finally {
                await queryRunner.release();
              }
              throw new HttpException(
                Request_Was_Successful,
                Request_Was_Successful.status_code,
              );
            } else {
              throw new HttpException(
                TheDataHasAlreadyBeenDeleted,
                TheDataHasAlreadyBeenDeleted.status_code,
              );
            }
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

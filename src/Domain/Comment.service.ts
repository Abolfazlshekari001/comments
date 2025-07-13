import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { commentEntity } from './entities/comment.entity';
import { AdminCheckDto } from './DTO/adminCheck.dto';
import { InternalServerError, NoContent, Unauthorized } from '../Common/translate/Error.Translate';
import { systemEntity } from './entities/system.entity';
import { ConditionEnum } from './entities/enums/condition.enum';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(commentEntity)
    private readonly commentRepository: Repository<commentEntity>,
    @InjectRepository(systemEntity)
    private readonly systemRepository: Repository<systemEntity>,
  ) {}
  async AdminConfirmation(AdminCheckDto: AdminCheckDto, commentId: string, postId: string): Promise<any> {
    try {
      const { status, system_name, system_password, section } = AdminCheckDto;
      const existingSystem = await this.systemRepository.findOne({
        where: {
          systemName: system_name,
          systemPassword: system_password,
        },
      });
      let findComment = await this.GetPostAndComment(commentId, postId, section);
      if (!existingSystem) {
        const unauthorizedErr = Unauthorized('سیستم نامعتبر است', 'The system is invalid');
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
      if (findComment) {
        if (
          (findComment.condition === ConditionEnum.Approved && status === true) ||
          (findComment.condition === ConditionEnum.Rejected && status === false)
        ) {
          return findComment;
        } else if (status === true) {
          findComment.condition = ConditionEnum.Approved;
          await this.commentRepository.save(findComment);
        } else if (status === false) {
          findComment.condition = ConditionEnum.Rejected;
          await this.commentRepository.save(findComment);
        }
        return findComment;
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }

  async GetPostAndComment(commentId: string, postId: string, section: string) {
    try {
      const result = await this.commentRepository.findOne({
        where: {
          id: commentId,
          postId: postId,
          section: section,
        },
        order: { updated_at: 'DESC' },
      });
      return result;
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }

  async getAllCommentSection(section: string) {
    try {
      const result = await this.commentRepository
        .createQueryBuilder('comments')
        .leftJoin('comments.mapReplys', 'mapReplys')
        .andWhere('comments.section = :section', { section })
        .andWhere('mapReplys.replyId IS NULL')
        .orderBy('comments.created_at', 'DESC')
        .getMany();

      return result;
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }

  async findSystem(system_name, system_password) {
    const result = await this.systemRepository.findOne({
      where: {
        systemName: system_name,
        systemPassword: system_password,
      },
    });
    return result;
  }
  async getLastTenComments(section: string, systemId: string) {
    const comments = await this.commentRepository
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.system', 'system')
    .leftJoinAndSelect('comment.mapComment', 'mapComment')
    .leftJoin('comment.mapReplys', 'mapReply')
    .leftJoinAndSelect('mapComment.replys', 'replys')
    .where('comment.section = :section', { section })
    .andWhere('comment.deletedAt IS NULL')
    .andWhere('mapReply.replyId IS NULL')
    .andWhere('system.id = :systemId', { systemId })
    .orderBy('comment.created_at', 'DESC')
    .take(10)
    .getMany();
    return comments.map((comment) => ({
      name: comment.name,
      rating: comment.rating,
    }));
  }
  async getAllCommentInSystem(userId, systemId, limit, offset) {

    const comments = await this.commentRepository
    .createQueryBuilder('comments')
    .leftJoinAndSelect('comments.mapComment', 'mapComment')
    .leftJoin('comments.mapReplys', 'mapReply')
    .leftJoinAndSelect('mapComment.replys', 'replys')
    .andWhere('mapReply.replyId IS NULL')
    .andWhere('comments.userId = :userId', { userId })
    .andWhere('comments.systemId = :systemId', { systemId })
    .andWhere('comments.deletedAt IS NULL')
    .orderBy('comments.created_at', 'DESC')
    .take(limit)
    .skip(offset)
    .getMany();
  
  return comments;
  
  }
}

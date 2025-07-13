import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { commentEntity } from './entities/comment.entity';
import { systemEntity } from './entities/system.entity';

import { IsNull, RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { AdminCheckDto } from './DTO/adminCheck.dto';
import { HttpException } from '@nestjs/common';
import { DataNotFound2, NoContent } from '../Common/translate/Error.Translate';

describe('AdminConfirmation', () => {
  let service: CommentService;
  let systemEntityRepository: Repository<systemEntity>;
  let commentRepository: Repository<commentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(systemEntity),
          useClass: Repository, 
        },
        {
          provide: getRepositoryToken(commentEntity),
          useClass: Repository,   
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    systemEntityRepository = module.get<Repository<systemEntity>>(
      getRepositoryToken(systemEntity),
    );
    commentRepository = module.get<Repository<commentEntity>>(
      getRepositoryToken(commentEntity),
    );
  });

  const systemMock: systemEntity = {
    id: 'system-id',
    systemEntity: 'javad',
    systemPassword: 'aa111aa',
    comment: [],
    hasRatingOption: false,
    hasId: function (): boolean {
      throw new Error('Function not implemented.');
    },
    save: function (options?: SaveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    remove: function (options?: RemoveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    softRemove: function (options?: SaveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    recover: function (options?: SaveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    reload: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
  };

  const systemMock1: systemEntity = {
    comment: [],
    id: '',
    systemEntity: '',
    systemPassword: '',
    hasRatingOption: false,
    hasId: function (): boolean {
      throw new Error('Function not implemented.');
    },
    save: function (options?: SaveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    remove: function (options?: RemoveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    softRemove: function (options?: SaveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    recover: function (options?: SaveOptions): Promise<systemEntity> {
      throw new Error('Function not implemented.');
    },
    reload: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
  };
  const commentMock: commentEntity = {
    id: '',
    condition: false,
    mapComment: [],
    mapReplys: [],
    system: new systemEntity(),
    likesAndDislikes: [],
    userId: '',
    name: '',
    email: '',
    commentText: '',
    likes: 0,
    dislike: 0,
    countUpdate: 0,
    numberReplays: 0,
    section: '',
    rating: 0,
    postId: '',
    deletedAt: '',
    created_at: undefined,
    updated_at: undefined,
    hasId: function (): boolean {
      throw new Error('Function not implemented.');
    },
    save: function (options?: SaveOptions): Promise<commentEntity> {
      throw new Error('Function not implemented.');
    },
    remove: function (options?: RemoveOptions): Promise<commentEntity> {
      throw new Error('Function not implemented.');
    },
    softRemove: function (options?: SaveOptions): Promise<commentEntity> {
      throw new Error('Function not implemented.');
    },
    recover: function (options?: SaveOptions): Promise<commentEntity> {
      throw new Error('Function not implemented.');
    },
    reload: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
  };
  describe('when system and comment exist', () => {
    it('should update comment condition when status is true', async () => {
      const commentId = 'ade65d4f-0611-4f9e-98c9-a849936d2d5e';
      const postId = 'ade65d4f-0611-4f9e-98c9-a849936d2d6';
      const adminCheckDto: AdminCheckDto = {
        status: true,
        system_name: 'javad',
        system_password: 'aa111aa',
        section: 'khabar',
      };

      jest.spyOn(service, 'AdminConfirmation').mockResolvedValue(systemMock);
      const result = await service.AdminConfirmation(
        adminCheckDto,
        commentId,
        postId,
      );
      expect(result).toEqual(systemMock);
    });
    describe('when system or comment is exist', () => {
      it('should throw HttpException when system is not found', async () => {
        const commentId = 'ade65d4f-0611-4f9e-98c9-a849936d2d5e';
        const postId = 'ade65d4f-0611-4f9e-98c9-a849936d2d6';
        const section = 'khabar';
        jest.spyOn(service, 'GetPostAndComment').mockResolvedValue(commentMock);
        const result = await service.GetPostAndComment(
          commentId,
          postId,
          section,
        );
        expect(service.GetPostAndComment).toHaveBeenCalledWith(
          commentId,
          postId,
          'khabar',
        );

        expect(result).toEqual(commentMock);
      });
    });

    it('should throw HttpException when system  AND comment is not found', async () => {
      const commentId = 'ade65d4f-0611-4f9e-98c9-a849936d2d5e';
      const postId = 'ade65d4f-0611-4f9e-98c9-a849936d2d6';
      const adminCheckDto: AdminCheckDto = {
        status: true,
        system_name: 'javad',
        system_password: 'aa111aa',
        section: 'khabar',
      };
      jest
        .spyOn(systemEntityRepository, 'findOne')
        .mockResolvedValue(systemMock1);
      jest.spyOn(service, 'GetPostAndComment').mockResolvedValue(null);
      await expect(
        service.AdminConfirmation(adminCheckDto, commentId, postId),
      ).rejects.toThrowError(HttpException);
      expect(systemEntityRepository.findOne).toHaveBeenCalledWith({
        where: { systemEntity: 'javad', systemPassword: 'aa111aa' },
      });
      expect(service.GetPostAndComment).toHaveBeenCalledWith(
        commentId,
        postId,
        'khabar',
      );
    });
  });
});

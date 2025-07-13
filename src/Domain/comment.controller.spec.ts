import { Test, TestingModule } from '@nestjs/testing';
import { commentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AdminCheckDto, AdminDtoResponseDto } from './DTO/adminCheck.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';


describe('CommentController', () => {
  let controller: commentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [commentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            AdminConfirmation: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {},
        },
        {
          provide: QueryBus,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<commentController>(commentController);
    service = module.get<CommentService>(CommentService);
  });

  describe('AdminCheck', () => {
    it('should call AdminConfirmation method with correct parameters', async () => {
      const commentId = 'ade65d4f-0611-4f9e-98c9-a849936d2d5e';
      const postId = 'ade65d4f-0611-4f9e-98c9-a849936d2d6';
      const adminCheckDto = new AdminCheckDto();
      adminCheckDto.status = true;
      adminCheckDto.system_name = 'javad';
      adminCheckDto.system_password = 'aa111aa';
      adminCheckDto.section = 'khabar';

      const expectedResult = new AdminDtoResponseDto();
      expectedResult.success = true;
      expectedResult.result = 'success';
      expectedResult.message = 'Operation completed successfully';

      jest.spyOn(service, 'AdminConfirmation').mockResolvedValue(expectedResult);

      const result = await controller.AdminCheck({} as any, commentId, postId, adminCheckDto);

      expect(service.AdminConfirmation).toHaveBeenCalledWith(adminCheckDto, commentId, postId);
      expect(result).toEqual(expectedResult);
    });
  });
});
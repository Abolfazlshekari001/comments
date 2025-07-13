import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CommentDto, CommentDtoResponseDto } from './DTO/comment.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentService } from './Comment.service';
import { addCommentCommand } from './CQRS/Commands/AddComments/add.Comment.command';
import { deleteCommentCommand } from './CQRS/Commands/deleteComment/deleteCmment.command';
import { updateCommentCommand } from './CQRS/Commands/updateComments/updateComment.command';
import { replyCommentCommand } from './CQRS/Commands/ReplyComment/reply.command';
import { GetOneCommentQuery } from './CQRS/queries/getOneComment/get-one-comment.query';
import { GetAllCommentQuery } from './CQRS/queries/getAllComments/get-All-comment.query';
import { AdminCheckDto, AdminDtoResponseDto } from './DTO/adminCheck.dto';
import { likeAndDisLikeCommentCommand } from './CQRS/Commands/likeAndDisLikes/likeAndDisLike.command';
import { GetReplyQuery } from './CQRS/queries/getReply/getReplyCommand.query';
import { GetUserCommentQuery } from './CQRS/queries/getUserComment/getUser-comment.qusey';
import { GetPostRatingsAverageQuery } from './CQRS/queries/getAveragePostScore/get-calculateAverage.query';
import { ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetRatingAverageQuery } from './CQRS/queries/averagScore/averagScore.query';
import { GetcommentForSectionQuery } from './CQRS/queries/getcommentForSection/getcommentForSection.quey';
import { AddCommentDtoResponseDto, AddCommentSubmitDto } from './DTO/addComment.dto';
import { AllCommentAndGetReplyQuery } from './CQRS/queries/getAllCommentAndReply/getAllCommentAndReply.query';
import { ConditionEnum } from './entities/enums/condition.enum';
import { AllCommentAndGetReplyUserQuery } from './CQRS/queries/getAllCommentAndReply-user/getAllCommentAndReply.query';
import { getLastTenRatingsQuery } from './CQRS/queries/getLastTenRatings/getLastTenRatings.query';
import { GetUserCommentsInSystemQuery } from './CQRS/queries/getAllCommentUserToToosFood/getAllCommentUserToToosFood.query';
import { GatewayGuard } from 'src/Common/guard/getWay.guard';
@UseGuards(GatewayGuard)
@Controller('comment')
export class commentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly commentService: CommentService,
  ) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'this api will send comment',
    description: 'this api send deleted for post & check system and postId ',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          name: 'test',
          email: 'rrrrrrrrrrrl@gmail.com',
          comment_text: 'is the best post ',
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
          Rating: '5',
          userId: 's3d5d1c0-69cd-4507-ab96-dbdc0b8a89v4',
        },
      },
      example2: {
        value: {
          name: 'جواد',
          email: 'rrrrrrrrrrrl@gmail.com',
          comment_text: 'بسیار خوب بود این پست',
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'مقاله',
          Rating: '5',
          userId: 's3d5d1c0-69cd-4507-ab96-dbdc0b8a89v4',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Post('addComment')
  async add(@Body() body: AddCommentSubmitDto, @Req() req): Promise<AddCommentDtoResponseDto> {
    const result = await this.commandBus.execute(new addCommentCommand(req, body));
    return result as AddCommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will deleted comment',
    description: 'this api deleted comments for post & check system and postId ',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be deleted',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          Section: 'maghale',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Delete('deleteComment/:commentId/:postId/:userId')
  async deleted(
    @Param('userId') userId: any,
    @Param('commentId') commentId: any,
    @Param('postId') postId: string,
    @Body() body: AdminCheckDto,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.commandBus.execute(new deleteCommentCommand(body, commentId, postId, userId));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will update comment',
    description: 'this api update comments for post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be deleted',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          comment_text: 'is the best post ',
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
          Rating: '5',
        },
      },
      example2: {
        value: {
          comment_text: 'بسیار خوب بود این پست',
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'مقاله',
          Rating: '5',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Put('updateComment/:commentId/:postId')
  async updateCam(
    @Body() body: CommentDto,
    @Req() req,
    @Param('commentId') commentId: any,
    @Param('postId') postId: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.commandBus.execute(new updateCommentCommand(body, req, commentId, postId));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will reply comment',
    description: 'this api reply comments for post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be deleted',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          comment_text: 'is the best post ',
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
        },
      },
      example2: {
        value: {
          comment_text: 'بسیار خوب بود این پست',
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'مقاله',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Post('reply/:commentId/:postId')
  async reply(
    @Body() body: CommentDto,
    @Req() req,
    @Param('commentId') commentId: any,
    @Param('postId') postId: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.commandBus.execute(new replyCommentCommand(body, req, commentId, postId));
    return result as CommentDtoResponseDto;
  }

  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be deleted',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'this api will get one comment',
    description: 'this api get one  comments for post & check system and postId and Section.',
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              examples: {
                id: '0ca7ef62-8ed6-4743-b9ba-4a8aa35a3d31',
                userId: null,
                name: 'هتهتهتهتهتهتهت',
                email: 'rrrrrrrrrrrl@gmail.com',
                commentText: 'دددخاخدخاخ',
                condition: ConditionEnum.Approved,
                likes: 0,
                dislike: 0,
                countUpdate: 0,
                numberReplays: 0,
                section: 'khabar',
                rating: 4,
                postId: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
                deletedAt: null,
                created_at: '2024-04-20T01:34:55.487Z',
                updated_at: '2024-04-20T01:35:39.030Z',
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Get('getComment/:commentId/:postId')
  async getComment(
    @Req() req,
    @Param('commentId') commentId: any,
    @Param('postId') postId: string,
    @Body() body: CommentDto,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetOneCommentQuery(req, commentId, postId, body));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will get all comment user',
    description: 'this apiget all comment user for post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the userId to be get comment',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Get('getUserComment/:userId')
  async getUserComment(
    @Req() req,
    @Param('userId') userId: any,
    @Body() body: CommentDto,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetUserCommentQuery(req, userId, body));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will get all comment in system',
    description: 'this api get all comment for post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for addComment ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Get('getAllComment/:postId')
  async getAllcomment(
    @Req() req,
    @Body() body: CommentDto,
    @Param('postId') postId: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetAllCommentQuery(req, body, postId));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will get all reply in comment',
    description: 'this api get all reply for comment from post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for get reply ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be  get reply',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Get('getReplyComment/:postId/:commentId')
  async getreplycomment(
    @Req() req,
    @Body() body: CommentDto,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetReplyQuery(req, body, postId, commentId));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will getcalculateAverage in post',
    description: 'this api getcalculateAverage in post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for get reply ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Get('getcalculateAverage/:postIds')
  async getcalculateAverage(
    @Req() req,
    @Body() body: CommentDto,
    @Param('postIds') postIds: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetPostRatingsAverageQuery(req, body, postIds));
    return result as CommentDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will AdminConfirmation  comment',
    description: 'this api Admin approve the comment from post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for AdminConfirmation ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be AdminConfirmation',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: AdminCheckDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
          status: 'true',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: AdminDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Post('AdminConfirmation/:commentId/:postId')
  async AdminCheck(
    @Req() req,
    @Param('commentId') commentId: any,
    @Param('postId') postId: string,
    @Body() adminCheckDto: AdminCheckDto,
  ): Promise<AdminDtoResponseDto> {
    const result = await this.commentService.AdminConfirmation(adminCheckDto, commentId, postId);
    return result as AdminDtoResponseDto;
  }
  @ApiOperation({
    summary: 'this api will like and dilike in comment',
    description: 'this api like and dilike in comment in post & check system and postId and Section',
  })
  @ApiParam({
    name: 'postId',
    description: 'Here, the post ID is entered in the parameters for get reply ',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the userId to be get comment',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be  get like and dislike',
    type: 'uuid',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: CommentDto,
    examples: {
      example1: {
        value: {
          system_name: 'javad',
          system_password: 'test12222',
          Section: 'maghale',
          like: 'true',
          DisLike: 'false',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CommentDtoResponseDto })
  @ApiResponse({ status: 409, description: 'DataNotFound' })
  @Post('likeAndDisLike/:commentId/:postId/:userId')
  async DisLike(
    @Req() req,
    @Param('commentId') commentId: any,
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Body() body: CommentDto,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.commandBus.execute(
      new likeAndDisLikeCommentCommand(req, body, commentId, postId, userId),
    );
    return result as CommentDtoResponseDto;
  }
  @Get('getRatingAverage/:postId')
  async Average(@Req() req, @Body() body: CommentDto, @Param('postId') postId: any): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetRatingAverageQuery(req, body, postId));
    return result as CommentDtoResponseDto;
  }

  @Get('commentForSection')
  async Section(
    @Req() req,
    @Body() body: CommentDto,
    //@Query('section') section: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetcommentForSectionQuery(req, body));
    return result as CommentDtoResponseDto;
  }

  @Get('AllCommentAndGetReply')
  async AllComentAndReply(@Req() req, @Body() body: CommentDto): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new AllCommentAndGetReplyQuery(req, body));
    return result as CommentDtoResponseDto;
  }

  @Get('AllCommentAndGetReplyUser')
  async AllComentAndReplyUser(@Req() req, @Body() body: CommentDto): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new AllCommentAndGetReplyUserQuery(req, body));
    return result as CommentDtoResponseDto;
  }

  @Get('getLastTenComments')
  async getLastTenComments(@Req() req, @Body() body: CommentDto): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new getLastTenRatingsQuery(req, body));
    return result as CommentDtoResponseDto;
  }

  @Get('getAllCommnetsToSystem/:userId')
  async getAllCommnetsToSystem(
    @Req() req,
    @Body() body: CommentDto,
    @Param('userId') userId: string,
  ): Promise<CommentDtoResponseDto> {
    const result = await this.queryBus.execute(new GetUserCommentsInSystemQuery(req, userId, body));
    return result as CommentDtoResponseDto;
  }
}

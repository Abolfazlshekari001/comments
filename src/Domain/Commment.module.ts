import { Module } from '@nestjs/common';
import { CommentService } from './Comment.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commentController } from './Comment.controller';
import { commentEntity } from './entities/comment.entity';
import { addCommentCommandHandler } from './CQRS/Commands/AddComments/add.Comments.command-handler';
import { TypeOrmConfig } from 'src/config/TypeOrm-Config/TypeOrm.Config';
import { deleteCommentCommandHandler } from './CQRS/Commands/deleteComment/deleteCommant.command-handler';
import { updateCommentCommandHandler } from './CQRS/Commands/updateComments/updatecomment.command-handler';
import { replyCommentCommandhandler } from './CQRS/Commands/ReplyComment/reply.command-handler';
import { mapCommentEntity } from './entities/mapComment.entity';
import { GetOneCommentQueryHandler } from './CQRS/queries/getOneComment/get-one-comment.query-handler';
import { GetAllCommentQueryHandler } from './CQRS/queries/getAllComments/get-All-comment.query.-handler';
import { systemEntity } from './entities/system.entity';
import { GetUserCommentQueryHandler } from './CQRS/queries/getUserComment/getUser-comment.query-handler';
import { likeAndDisLikeEntiy } from './entities/likeAndDisLike.entity';
import { likeAndDisLikeCommentCommandHandler } from './CQRS/Commands/likeAndDisLikes/likeAndDisLike.command-handler';
import { GetReplyQueryHandler } from './CQRS/queries/getReply/getReplyCommand.query-handler';
import { GetPostRatingsAverageQueryHandler } from './CQRS/queries/getAveragePostScore/get-calculateAverage.query-handler';
import { GetRatingAverageQueryHandler } from './CQRS/queries/averagScore/averagScore.query-handler';
import { GetcommentForSectionQueryHandler } from './CQRS/queries/getcommentForSection/getcommentForSection.quey-handler';
import { AllCommentAndGetReplyQueryHandler } from './CQRS/queries/getAllCommentAndReply/getAllCommentAndReply.query-handler';
import { AllCommentAndGetReplyUserQueryHandler } from './CQRS/queries/getAllCommentAndReply-user/getAllCommentAndReply.query-handler';
import { getLastTenRatingsQueryHandler } from './CQRS/queries/getLastTenRatings/getLastTenRatings.query-handler';
import { GetUserCommentsInSystemQueryHandler } from './CQRS/queries/getAllCommentUserToToosFood/getAllCommentUserToToosFood.query-handler';

export const CommandHandlers = [
  addCommentCommandHandler,
  deleteCommentCommandHandler,
  updateCommentCommandHandler,
  replyCommentCommandhandler,
  likeAndDisLikeCommentCommandHandler,
  GetRatingAverageQueryHandler,
  GetcommentForSectionQueryHandler,
  AllCommentAndGetReplyQueryHandler,
  AllCommentAndGetReplyUserQueryHandler,
];

export const QueriesHandlers = [
  GetOneCommentQueryHandler,
  GetAllCommentQueryHandler,
  GetUserCommentQueryHandler,
  GetReplyQueryHandler,
  GetPostRatingsAverageQueryHandler,
  getLastTenRatingsQueryHandler,
  GetUserCommentsInSystemQueryHandler,
];

export const EventHandlers = [];

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([commentEntity, mapCommentEntity, systemEntity, likeAndDisLikeEntiy]),
    CqrsModule,
  ],
  controllers: [commentController],
  providers: [CommentService, ...CommandHandlers, ...EventHandlers, ...QueriesHandlers],
  exports: [CommentService, ...CommandHandlers, ...EventHandlers, ...QueriesHandlers],
})
export class commentModule {}

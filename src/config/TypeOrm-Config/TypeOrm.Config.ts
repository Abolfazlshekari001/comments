import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { commentEntity } from 'src/Domain/entities/comment.entity';
import { likeAndDisLikeEntiy } from 'src/Domain/entities/likeAndDisLike.entity';
import { mapCommentEntity } from 'src/Domain/entities/mapComment.entity';
import { systemEntity } from 'src/Domain/entities/system.entity';
dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});

export const TypeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    port: parseInt(process.env.DB_PORT as string),
    database: process.env.DB_NAME,
    entities:[commentEntity,mapCommentEntity,systemEntity,likeAndDisLikeEntiy], 
    synchronize: true,
  };
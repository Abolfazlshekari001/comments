import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { commentEntity } from './comment.entity';

@Entity('likeAndDisLike')
export class likeAndDisLikeEntiy extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: 'UNFILLED' })
  RectionUser: string;

  @ApiProperty()
  @Column({ default: false })
  userId: string;

  @ApiProperty()
  @ManyToOne(() => commentEntity, comment => comment.likesAndDislikes)
  @JoinColumn({referencedColumnName:'id', name: 'commentId' })
  comment: commentEntity;
}

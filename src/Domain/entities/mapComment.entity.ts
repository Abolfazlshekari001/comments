import {
  BaseEntity,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { commentEntity } from './comment.entity';
@Entity('mapComment')
export class mapCommentEntity extends BaseEntity {
  @ManyToOne(() => commentEntity, (comments) => comments.mapComment)
  @JoinColumn({ referencedColumnName: 'id', name: 'commentId' })
  comments: commentEntity;

  @ManyToOne(() => commentEntity, (replys) => replys.mapReplys)
  @JoinColumn({ referencedColumnName: 'id', name: 'replyId' })
  replys: commentEntity;

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @DeleteDateColumn({ nullable: true })
  deletedAt: string;
}

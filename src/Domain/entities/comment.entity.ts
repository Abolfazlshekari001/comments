import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { mapCommentEntity } from './mapComment.entity';
import { systemEntity } from './system.entity';
import { likeAndDisLikeEntiy } from './likeAndDisLike.entity';
import { ConditionEnum } from './enums/condition.enum';

@Entity('Comments')
export class commentEntity extends BaseEntity {
  @OneToMany(() => mapCommentEntity, (mapComment) => mapComment.comments)
  mapComment: mapCommentEntity[];

  @OneToMany(() => mapCommentEntity, (map) => map.replys)
  mapReplys: mapCommentEntity[];

  @ManyToOne(() => systemEntity, (system) => system.comment)
  @JoinColumn({ referencedColumnName: 'id', name: 'systemId' })
  system: systemEntity;

  @OneToMany(
    () => likeAndDisLikeEntiy,
    (likeAndDislike) => likeAndDislike.comment,
  )
  likesAndDislikes: likeAndDisLikeEntiy[];

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true })
  userId: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  commentText: string;

  @ApiProperty()
  @Column({ default: ConditionEnum.Pending })
  condition: ConditionEnum;

  @ApiProperty()
  @Column({ default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ default: 0 })
  dislike: number;

  @ApiProperty()
  @Column({ default: 0 })
  countUpdate: number;

  @ApiProperty()
  @Column({ default: 0 })
  numberReplays: number;

  @ApiProperty()
  @Column({ nullable: false })
  section: string;

  @ApiProperty()
  @Column({ nullable: true })
  rating: number;

  @ApiProperty()
  @Column({ default: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e' })
  postId: string;

  @ApiProperty()
  @DeleteDateColumn({ nullable: true })
  deletedAt: string;

  @ApiProperty()
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}

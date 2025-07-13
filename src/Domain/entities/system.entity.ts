import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { commentEntity } from './comment.entity';
@Unique(['systemName'])
@Entity('system')
export class systemEntity extends BaseEntity {
  @OneToMany(() => commentEntity, (comment) => comment.system)
  comment: commentEntity[];

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  systemName: string;

  @ApiProperty()
  @Column()
  systemPassword: string;

  @ApiProperty()
  @Column({ default: false })
  hasRatingOption: boolean;
}

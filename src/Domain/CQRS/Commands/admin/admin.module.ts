import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmConfig } from 'src/config/TypeOrm-Config/TypeOrm.Config';
import { systemEntity } from 'src/Domain/entities/system.entity';
import { addSystemCommandHandler } from './add-system.command-handler';
import { adminService } from './admin.service';
import { adminController } from './admin.controller';

export const CommandHandlers = [addSystemCommandHandler];

export const QueriesHandlers = [];

export const EventHandlers = [];

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([systemEntity]),
    CqrsModule,
  ],
  controllers: [adminController],
  providers: [
    adminService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
  exports: [
    adminService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
})
export class adminModule {}

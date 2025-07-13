import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './config/TypeOrm-Config/TypeOrm.Config';
import { commentModule } from './Domain/Commment.module';
import { adminModule } from './Domain/CQRS/Commands/admin/admin.module';

@Module({
  imports: [commentModule,adminModule, TypeOrmModule.forRoot(TypeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

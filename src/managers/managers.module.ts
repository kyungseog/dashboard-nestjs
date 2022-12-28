import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Managers } from '../entities/managers.entity';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Managers])],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}

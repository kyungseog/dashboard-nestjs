import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapanController } from './japan.controller';
import { JapanUsers } from '../entities/japan-users.entity';
import { JapanService } from './japan.service';

@Module({
  imports: [TypeOrmModule.forFeature([JapanUsers])],
  controllers: [JapanController],
  providers: [JapanService],
})
export class JapanModule {}

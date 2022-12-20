import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapanController } from './japan.controller';
import { Japan } from './japan.entity';
import { JapanService } from './japan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Japan])],
  controllers: [JapanController],
  providers: [JapanService],
})
export class JapanModule {}

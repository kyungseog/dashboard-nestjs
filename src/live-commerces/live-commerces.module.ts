import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveCommerce } from '../entities/live-commerces.entity';
import { LiveCommercesController } from './live-commerces.controller';
import { LiveCommercesService } from './live-commerces.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveCommerce])],
  controllers: [LiveCommercesController],
  providers: [LiveCommercesService],
})
export class LiveCommercesModule {}

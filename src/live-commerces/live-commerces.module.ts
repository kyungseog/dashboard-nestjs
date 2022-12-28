import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveCommerces } from '../entities/live-commerces.entity';
import { LiveCommercesController } from './live-commerces.controller';
import { LiveCommercesService } from './live-commerces.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveCommerces])],
  controllers: [LiveCommercesController],
  providers: [LiveCommercesService],
})
export class LiveCommercesModule {}

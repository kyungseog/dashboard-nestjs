import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { LiveCommercesController } from './live-commerces.controller';
import { LiveCommercesService } from './live-commerces.service';

@Module({
  imports: [TypeOrmModule.forFeature([KoreaLives, KoreaOrders])],
  controllers: [LiveCommercesController],
  providers: [LiveCommercesService],
})
export class LiveCommercesModule {}

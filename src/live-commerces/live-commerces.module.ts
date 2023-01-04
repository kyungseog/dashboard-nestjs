import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { LiveCommercesController } from './live-commerces.controller';
import { LiveCommercesService } from './live-commerces.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveCommerces, KoreaOrders])],
  controllers: [LiveCommercesController],
  providers: [LiveCommercesService],
})
export class LiveCommercesModule {}

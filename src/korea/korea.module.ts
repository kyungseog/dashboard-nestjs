import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaCoupons } from 'src/entities/korea-coupons.entity';
import { KoreaExpenses } from 'src/entities/korea-expenses.entity';
import { KoreaDeliveries } from 'src/entities/korea-deliveries.entity';
import { KoreaMarketings } from 'src/entities/korea-marketings.entity';
import { KoreaMileages } from 'src/entities/korea-mileages.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { KoreaController } from './korea.controller';
import { KoreaService } from './korea.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KoreaUsers,
      KoreaOrders,
      KoreaCoupons,
      KoreaMileages,
      KoreaDeliveries,
      KoreaMarketings,
      KoreaExpenses,
    ]),
  ],
  controllers: [KoreaController],
  providers: [KoreaService],
})
export class KoreaModule {}

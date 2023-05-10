import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaCoupons } from 'src/entities/korea-coupons.entity';
import { KoreaExpenses } from 'src/entities/korea-expenses.entity';
import { KoreaDeliveries } from 'src/entities/korea-deliveries.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaMileages } from 'src/entities/korea-mileages.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { Products } from 'src/entities/products.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { Squads } from 'src/entities/squads.entity';
import { KoreaIfdo } from 'src/entities/korea-ifdo.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { EssentialController } from './mmz-essential.controller';
import { EssentialService } from './mmz-essential.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KoreaUsers,
      KoreaOrders,
      KoreaCoupons,
      KoreaMileages,
      KoreaDeliveries,
      KoreaMarketing,
      KoreaExpenses,
      KoreaBudget,
      Products,
      Squads,
      KoreaIfdo,
      KoreaAllocationFees,
      LiveCommerces,
    ]),
  ],
  controllers: [EssentialController],
  providers: [EssentialService],
})
export class EssentialModule {}

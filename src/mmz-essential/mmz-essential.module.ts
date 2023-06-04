import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaCoupons } from 'src/entities/korea-coupons.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { Products } from 'src/entities/products.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { DayKoreaBrands } from 'src/entities/day-korea-brands.entity';
import { MonthKoreaBrands } from 'src/entities/month-korea-brands.entity';
import { ProductEssentials } from 'src/entities/product-essentials.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { EssentialController } from './mmz-essential.controller';
import { EssentialService } from './mmz-essential.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KoreaUsers,
      KoreaOrders,
      KoreaCoupons,
      KoreaMarketing,
      KoreaBudget,
      Products,
      KoreaAllocationFees,
      ProductEssentials,
      DayKoreaBrands,
      MonthKoreaBrands,
    ]),
  ],
  controllers: [EssentialController],
  providers: [EssentialService],
})
export class EssentialModule {}

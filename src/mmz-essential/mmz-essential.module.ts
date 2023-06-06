import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaCoupons } from 'src/entities/korea-coupons.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { Products } from 'src/entities/products.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { DayKoreaBrands } from 'src/entities/day-korea-brands.entity';
import { ProductEssentialsSales } from 'src/entities/product-essentials-sales.entity';
import { ProductEssentialsProduction } from 'src/entities/product-essentials-production.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { EssentialController } from './mmz-essential.controller';
import { EssentialService } from './mmz-essential.service';
import { Stocks } from 'src/entities/stocks.entity';

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
      ProductEssentialsSales,
      ProductEssentialsProduction,
      DayKoreaBrands,
      Stocks,
    ]),
  ],
  controllers: [EssentialController],
  providers: [EssentialService],
})
export class EssentialModule {}

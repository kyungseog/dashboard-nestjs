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
import { ProductEssentialsProducts } from 'src/entities/product-essentials-products.entity';
import { ProductEssentialsVariants } from 'src/entities/product-essentials-variants.entity';
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
      ProductEssentialsProducts,
      ProductEssentialsVariants,
      DayKoreaBrands,
      Stocks,
    ]),
  ],
  controllers: [EssentialController],
  providers: [EssentialService],
})
export class EssentialModule {}

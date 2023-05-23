import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { Products } from 'src/entities/products.entity';
import { Squads } from 'src/entities/squads.entity';
import { DayKoreaBrands } from 'src/entities/day-korea-brands.entity';
import { MonthKoreaBrands } from 'src/entities/month-korea-brands.entity';
import { SquadsController } from './squads.controller';
import { SquadsService } from './squads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KoreaOrders,
      KoreaMarketing,
      KoreaBudget,
      Products,
      Squads,
      KoreaAllocationFees,
      KoreaLives,
      MonthKoreaBrands,
      DayKoreaBrands,
    ]),
  ],
  controllers: [SquadsController],
  providers: [SquadsService],
})
export class SquadsModule {}

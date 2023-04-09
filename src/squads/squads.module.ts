import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { Products } from 'src/entities/products.entity';
import { Squads } from 'src/entities/squads.entity';
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
      LiveCommerces,
    ]),
  ],
  controllers: [SquadsController],
  providers: [SquadsService],
})
export class SquadsModule {}

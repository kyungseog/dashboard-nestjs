import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { Products } from 'src/entities/products.entity';
import { Squads } from 'src/entities/squads.entity';
import { SquadController } from './squad.controller';
import { SquadService } from './squad.service';

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
  controllers: [SquadController],
  providers: [SquadService],
})
export class SquadModule {}

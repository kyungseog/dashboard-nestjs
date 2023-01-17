import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapanController } from './japan.controller';
import { JapanUsers } from '../entities/japan-users.entity';
import { JapanService } from './japan.service';
import { JapanOrders } from 'src/entities/japan-orders.entity';
import { JapanCoupons } from 'src/entities/japan-coupons.entity';
import { JapanMileages } from 'src/entities/japan-mileages.entity';
import { JapanDeliveries } from 'src/entities/japan-deliveries.entity';
import { JapanMarketingMeta } from 'src/entities/japan-marketing-meta.entity';
import { JapanZipcodes } from 'src/entities/japan-zipcodes.entity';
import { JapanExpenses } from 'src/entities/japan-expenses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JapanUsers,
      JapanOrders,
      JapanCoupons,
      JapanMileages,
      JapanDeliveries,
      JapanMarketingMeta,
      JapanZipcodes,
      JapanExpenses,
    ]),
  ],
  controllers: [JapanController],
  providers: [JapanService],
})
export class JapanModule {}

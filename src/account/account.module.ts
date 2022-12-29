import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountAdjustments } from 'src/entities/account-adjustments.entity';
import { AccountClaims } from 'src/entities/account-claims.entity';
import { AccountDeliveries } from 'src/entities/account-deliveries.entity';
import { AccountOrders } from 'src/entities/account-orders.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountAdjustments,
      AccountClaims,
      AccountDeliveries,
      AccountOrders,
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

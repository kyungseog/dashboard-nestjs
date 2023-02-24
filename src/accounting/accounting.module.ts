import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountAdjustments } from 'src/entities/account-adjustments.entity';
import { AccountClaims } from 'src/entities/account-claims.entity';
import { AccountDeliveries } from 'src/entities/account-deliveries.entity';
import { AccountOrdersConsignment } from 'src/entities/account-orders-consignment.entity';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountAdjustments,
      AccountClaims,
      AccountDeliveries,
      AccountOrdersConsignment,
    ]),
  ],
  controllers: [AccountingController],
  providers: [AccountingService],
})
export class AccountingModule {}

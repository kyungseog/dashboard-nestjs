import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Products } from 'src/entities/products.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { Costs } from 'src/entities/costs.entity';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { Stocks } from 'src/entities/stocks.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KoreaOrders,
      Brands,
      Suppliers,
      KoreaLives,
      Products,
      KoreaMarketing,
      KoreaAllocationFees,
      Costs,
      ExchangeRate,
      KoreaUsers,
      Stocks,
      HttpModule,
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}

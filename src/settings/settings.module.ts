import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Products } from 'src/entities/products.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { JapanLives } from 'src/entities/japan-lives.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapanMarketing } from 'src/entities/japan-marketing.entity';

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
      JapanLives,
      JapanMarketing,
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}

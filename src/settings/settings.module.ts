import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Products } from 'src/entities/products.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { JapanLives } from 'src/entities/japan-lives.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KoreaOrders,
      Brands,
      Suppliers,
      LiveCommerces,
      Products,
      KoreaMarketing,
      KoreaAllocationFees,
      JapanLives,
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}

import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Products } from 'src/entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KoreaOrders, Brands, Suppliers])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}

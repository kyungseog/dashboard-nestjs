import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { Suppliers } from 'src/entities/suppliers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KoreaOrders, Brands, Suppliers])],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}

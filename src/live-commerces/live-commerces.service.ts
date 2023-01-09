import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { ProductVariants } from 'src/entities/product-variants.entity';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class LiveCommercesService {
  constructor(
    @InjectRepository(LiveCommerces)
    private liveCommerceRepository: Repository<LiveCommerces>,
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
  ) {}

  async getLiveCommerce(start_date: Date): Promise<LiveCommerces> {
    const found = await this.liveCommerceRepository
      .createQueryBuilder('live')
      .leftJoinAndSelect(Brands, 'brand', 'live.brand_id = brands.id')
      .where('live.start_date = :start_date', { start_date: start_date })
      .getRawOne();
    if (!found) {
      throw new NotFoundException(`can't find live datas`);
    }
    return found;
  }

  async getLiveSales(liveSales): Promise<KoreaOrders[]> {
    const { brand_id, start_datetime, end_datetime } = liveSales;
    const salesData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect(
        ProductVariants,
        'variant',
        'order.product_variant_id = variant.id',
      )
      .leftJoinAndSelect(Products, 'product', 'variant.product_id = product.id')
      .where('order.brand_id = :brand_id', { brand_id: brand_id })
      .andWhere('order.payment_date > :start_datetime', {
        start_datetime: start_datetime,
      })
      .andWhere('order.payment_date < :end_datetime', {
        end_datetime: end_datetime,
      })
      .getRawMany();
    if (!salesData) {
      throw new NotFoundException(`can't find live sales datas`);
    }
    return salesData;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KoreaLives } from 'src/entities/korea-lives.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class LiveCommercesService {
  constructor(
    @InjectRepository(KoreaLives)
    private liveCommerceRepository: Repository<KoreaLives>,
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
  ) {}

  async getLiveCommerce(start_date: Date): Promise<KoreaLives> {
    const found = await this.liveCommerceRepository
      .createQueryBuilder('live')
      .leftJoinAndSelect(Brands, 'brand', 'live.brand_id = brand.id')
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
      .leftJoinAndSelect(Products, 'product', 'order.product_id = product.id')
      .where('product.brand_id = :brand_id', { brand_id: brand_id })
      .andWhere(
        'order.payment_date BETWEEN :start_datetime AND :end_datetime',
        {
          start_datetime: start_datetime,
          end_datetime: end_datetime,
        },
      )
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .getRawMany();
    if (!salesData) {
      throw new NotFoundException(`can't find live sales datas`);
    }
    return salesData;
  }
}

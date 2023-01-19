import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class KoreaService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
  ) {}

  async getSales(sales): Promise<KoreaOrders[]> {
    const { today, type } = sales;
    if (type === '1') {
      const salesData = await this.koreaOrdersRepository
        .createQueryBuilder('koreaOrders')
        .select(
          'SUM(koreaOrders.sale_price) - SUM(koreaOrders.discount_price)',
          'sales_price',
        )
        .addSelect('COUNT(DISTINCT(koreaOrders.id))', 'order_count')
        .where('DATE(koreaOrders.payment_date) = :today', { today: today })
        .andWhere('koreaOrders.status_id IN (:...ids)', {
          ids: ['p1', 'g1', 'd1', 'd2', 's1'],
        })
        .groupBy('DATE(koreaOrders.payment_date)')
        .getRawOne();
      if (!salesData) {
        throw new NotFoundException(`can't find today's sales datas`);
      }
      return salesData;
    }
    if (type === '10') {
      const beforeDay = DateTime.fromISO(today)
        .minus({ days: 10 })
        .toFormat('yyyy-LL-dd');
      const salesData = await this.koreaOrdersRepository
        .createQueryBuilder('koreaOrders')
        .select('DATE(koreaOrders.payment_date)', 'payment_date')
        .addSelect(
          'SUM(koreaOrders.sale_price) - SUM(koreaOrders.discount_price)',
          'sales_price',
        )
        .where('DATE(koreaOrders.payment_date) < :today', { today: today })
        .andWhere('DATE(koreaOrders.payment_date) >= :beforeDay', {
          beforeDay: beforeDay,
        })
        .andWhere('koreaOrders.status_id IN (:...ids)', {
          ids: ['p1', 'g1', 'd1', 'd2', 's1'],
        })
        .groupBy('DATE(koreaOrders.payment_date)')
        .getRawMany();
      if (!salesData) {
        throw new NotFoundException(`can't find days sales datas`);
      }
      return salesData;
    }
  }

  async getBrandSales(brandSales): Promise<KoreaOrders[]> {
    const { today, type } = brandSales;
    let targetDay: string;
    let beforeDay: string;
    if (type === '1') {
      targetDay = DateTime.fromISO(today)
        .plus({ days: 1 })
        .toFormat('yyyy-LL-dd');
      beforeDay = today;
    } else {
      targetDay = today;
      beforeDay = DateTime.fromISO(today)
        .minus({ days: Number(type) })
        .toFormat('yyyy-LL-dd');
    }
    const salesData = await this.koreaOrdersRepository
      .createQueryBuilder('koreaOrders')
      .leftJoin(Products, 'product', 'koreaOrders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .select('product.brand_id', 'brand_id')
      .addSelect('brand.name', 'brand_name')
      .addSelect('COUNT(DISTINCT(koreaOrders.id))', 'order_count')
      .addSelect('SUM(koreaOrders.quantity)', 'quantity')
      .addSelect(
        'SUM(koreaOrders.sale_price) - SUM(koreaOrders.discount_price)',
        'sales_price',
      )
      .where('DATE(koreaOrders.payment_date) < :targetDay', {
        targetDay: targetDay,
      })
      .andWhere('DATE(koreaOrders.payment_date) >= :beforeDay', {
        beforeDay: beforeDay,
      })
      .andWhere('koreaOrders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .groupBy('product.brand_id')
      .orderBy('sales_price', 'DESC')
      .limit(6)
      .getRawMany();
    if (!salesData) {
      throw new NotFoundException(`can't find days sales datas`);
    }
    return salesData;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Costs } from 'src/entities/costs.entity';

@Injectable()
export class EssentialService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
  ) {}

  salesQuery = this.koreaOrdersRepository
    .createQueryBuilder('orders')
    .leftJoin(Products, 'product', 'orders.product_id = product.id')
    .leftJoin(
      Costs,
      'cost',
      'orders.product_variant_id = cost.product_variant_id',
    )
    .select(
      'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
      'sales_price',
    )
    .addSelect('COUNT(DISTINCT(orders.id))', 'order_count')
    .where('product.brand_id = "B0000CAT"')
    .andWhere('orders.status_id IN (:...ids)', {
      ids: ['p1', 'g1', 'd1', 'd2', 's1'],
    })
    .andWhere('orders.user_id != "mmzjapan"');

  productQuery = this.koreaOrdersRepository
    .createQueryBuilder('orders')
    .leftJoin(Products, 'product', 'orders.product_id = product.id')
    .leftJoin(
      Costs,
      'cost',
      'orders.product_variant_id = cost.product_variant_id',
    )
    .select('product.id', 'product_id')
    .addSelect('product.name', 'product_name')
    .addSelect('product.image', 'image')
    .addSelect('SUM(orders.quantity)', 'quantity')
    .addSelect(
      'SUM((orders.sale_price - orders.discount_price) * quantity)',
      'sales_price',
    )
    .where('product.brand_id = "B0000CAT"')
    .andWhere('orders.status_id IN (:...ids)', {
      ids: ['p1', 'g1', 'd1', 'd2', 's1'],
    })
    .andWhere('orders.user_id != "mmzjapan"');

  getSalesByHour(startDay: string, endDay: string) {
    return this.salesQuery
      .addSelect('DAY(orders.payment_date)', 'payment_day')
      .addSelect('HOUR(orders.payment_date)', 'payment_hour')
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('DAY(payment_date), HOUR(payment_date)')
      .getRawMany();
  }

  getSalesByDay(startDay: string, endDay: string) {
    return this.salesQuery
      .addSelect('DATE(orders.payment_date)', 'payment_date')
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('orders.payment_date != :exceptDate', {
        exceptDate: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd 00:00:00'),
      })
      .groupBy('DATE(orders.payment_date)')
      .getRawMany();
  }

  getSalesByPeriod(startDay: string, endDay: string) {
    return this.salesQuery
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('orders.payment_date != :exceptDate', {
        exceptDate: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd 00:00:00'),
      })
      .getRawOne();
  }

  getProductSalesPeriod(startDay: string, endDay: string) {
    return this.productQuery
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .groupBy('product.id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }

  getProductSalesDay(startDay: string, endDay: string) {
    return this.productQuery
      .addSelect('DATE(orders.payment_date)', 'payment_date')
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .groupBy('product.id, DATE(orders.payment_date)')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }

  getProductSalesHour(startDay: string, endDay: string) {
    return this.productQuery
      .addSelect('DAY(orders.payment_date)', 'payment_day')
      .addSelect('HOUR(orders.payment_date)', 'payment_hour')
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('product.id, HOUR(payment_date)')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }

  getProductSalesHourPeriod(startDay: string, endDay: string) {
    return this.productQuery
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('product.id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }
}

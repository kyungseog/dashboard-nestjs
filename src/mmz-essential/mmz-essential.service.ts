import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { DayKoreaBrands } from 'src/entities/day-korea-brands.entity';
import { Products } from 'src/entities/products.entity';
import { Costs } from 'src/entities/costs.entity';
import { ProductEssentialsSales } from 'src/entities/product-essentials-sales.entity';
import { ProductEssentialsProduction } from 'src/entities/product-essentials-production.entity';

@Injectable()
export class EssentialService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(DayKoreaBrands)
    private dayKoreaBrandsRepository: Repository<DayKoreaBrands>,
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
      'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
      'sales_price',
    )
    .where('product.brand_id = "B0000CAT"')
    .andWhere('orders.status_id IN (:...ids)', {
      ids: ['p1', 'g1', 'd1', 'd2', 's1'],
    })
    .andWhere('orders.user_id != "mmzjapan"');

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

  getSalesByWeek(startDay: string, endDay: string) {
    return this.dayKoreaBrandsRepository
      .createQueryBuilder('data')
      .select('SUM(data.order_count)', 'order_count')
      .addSelect('SUM(data.quantity)', 'quantity')
      .addSelect('SUM(data.sales)', 'sales')
      .addSelect('SUM(data.commission)', 'commission')
      .addSelect('SUM(data.cost)', 'cost')
      .addSelect('SUM(data.order_coupon)', 'order_coupon')
      .addSelect('SUM(data.product_coupon)', 'product_coupon')
      .addSelect('SUM(data.mileage)', 'mileage')
      .addSelect('SUM(data.pg_fee)', 'pg_fee')
      .addSelect('SUM(data.direct_marketing_fee)', 'direct_marketing_fee')
      .addSelect('SUM(data.indirect_marketing_fee)', 'indirect_marketing_fee')
      .addSelect('SUM(data.logistic_fee)', 'logistic_fee')
      .addSelect('SUM(data.contribution_margin)', 'contribution_margin')
      .addSelect('DATE_FORMAT(data.payment_date,"%Y-%v")', 'year_week')
      .addSelect(
        'CONCAT(DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(2-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d")," - ",DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(8-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d"))',
        'date_range',
      )
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('data.brand_id = "B0000CAT"')
      .groupBy('year_week')
      .getRawMany();
  }

  getSalesByMonth(startDay: string, endDay: string) {
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
    return this.dayKoreaBrandsRepository
      .createQueryBuilder('data')
      .select('data.payment_date', 'payment_date')
      .addSelect('SUM(data.order_count)', 'order_count')
      .addSelect('SUM(data.quantity)', 'quantity')
      .addSelect('SUM(data.sales)', 'sales')
      .addSelect('SUM(data.commission)', 'commission')
      .addSelect('SUM(data.cost)', 'cost')
      .addSelect('SUM(data.order_coupon)', 'order_coupon')
      .addSelect('SUM(data.product_coupon)', 'product_coupon')
      .addSelect('SUM(data.mileage)', 'mileage')
      .addSelect('SUM(data.pg_fee)', 'pg_fee')
      .addSelect('SUM(data.direct_marketing_fee)', 'direct_marketing_fee')
      .addSelect('SUM(data.indirect_marketing_fee)', 'indirect_marketing_fee')
      .addSelect('SUM(data.logistic_fee)', 'logistic_fee')
      .addSelect('SUM(data.contribution_margin)', 'contribution_margin')
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('data.brand_id = "B0000CAT"')
      .groupBy('payment_date')
      .getRawMany();
  }

  getCategorySales(startDay: string, endDay: string) {
    return this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(
        ProductEssentialsSales,
        'sales',
        'orders.product_variant_id = sales.product_variant_id',
      )
      .leftJoin(
        ProductEssentialsProduction,
        'production',
        'sales.barcode = production.barcode',
      )
      .select('production.age', 'age')
      .addSelect('production.category', 'category')
      .addSelect('SUM(orders.quantity)', 'quantity')
      .addSelect(
        'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
        'sales_price',
      )
      .addSelect('SUM(orders.quantity * production.post_cost)', 'cost')
      .where('product.brand_id = "B0000CAT"')
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('age, category')
      .getRawMany();
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

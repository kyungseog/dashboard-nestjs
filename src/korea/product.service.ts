import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { DataSource, Repository } from 'typeorm';
import { Costs } from 'src/entities/costs.entity';
import { DateTime } from 'luxon';

@Injectable()
export class ProductService {
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
    .addSelect('product.brand_id', 'brand_id')
    .addSelect('COUNT(DISTINCT(orders.id))', 'order_count')
    .addSelect('SUM(orders.quantity)', 'quantity')
    .addSelect(
      'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
      'sales_price',
    )
    .addSelect(
      'ROUND(SUM((orders.sale_price - orders.discount_price) * orders.quantity * orders.commission_rate / 100))',
      'commission',
    )
    .addSelect(
      'SUM(IF(cost.cost IS NULL, 0, cost.cost) * orders.quantity)',
      'cost',
    )
    .addSelect('SUM(orders.mileage)', 'mileage')
    .addSelect('SUM(orders.order_coupon)', 'order_coupon')
    .addSelect('SUM(orders.product_coupon)', 'product_coupon')
    .addSelect(
      'IF(orders.channel = "shop", ROUND(SUM((orders.sale_price - orders.discount_price) * orders.quantity - orders.mileage - orders.order_coupon - orders.product_coupon) * 0.032), ROUND(SUM((orders.sale_price - orders.discount_price) * orders.quantity - orders.mileage - orders.order_coupon - orders.product_coupon) * 0.034))',
      'pg_expense',
    );

  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  getProductSales(startDay: string, endDay: string) {
    return this.productQuery
      .where('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('product.id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }
}

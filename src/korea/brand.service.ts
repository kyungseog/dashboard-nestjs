import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Costs } from 'src/entities/costs.entity';

@Injectable()
export class BrandService {
  brandQuery = this.koreaOrdersRepository
    .createQueryBuilder('orders')
    .leftJoin(Products, 'product', 'orders.product_id = product.id')
    .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
    .leftJoin(Suppliers, 'supplier', 'brand.supplier_id = supplier.id')
    .leftJoin(
      Costs,
      'cost',
      'orders.product_variant_id = cost.product_variant_id',
    )
    .select('product.brand_id', 'brand_id')
    .addSelect('brand.name', 'brand_name')
    .addSelect('brand.type', 'brand_type')
    .addSelect('brand.squad', 'brand_squad')
    .addSelect('brand.manager_id', 'md_id')
    .addSelect('supplier.id', 'supplier_id')
    .addSelect('supplier.integration_name', 'supplier_name')
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

  getBrandSales(startDay: string, endDay: string) {
    return this.brandQuery
      .where('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('product.brand_id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }

  getProductSalesByBrand(startDay: string, endDay: string) {
    return this.brandQuery
      .addSelect('product.id', 'product_id')
      .addSelect('product.image', 'image')
      .addSelect('product.name', 'product_name')
      .where('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('product.brand_id, product.id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
  }

  async getBrandChartSales(brandId: string): Promise<KoreaOrders[][]> {
    const thisYearData = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .select('DATE(orders.payment_date)', 'payment_date')
      .addSelect(
        'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
        'sales_price',
      )
      .where('orders.payment_date BETWEEN :startDate AND :tomorrow', {
        startDate: DateTime.now().minus({ days: 13 }).toFormat('yyyy-LL-dd'),
        tomorrow: DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd'),
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('product.brand_id = :brandId', { brandId: brandId })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('DATE(orders.payment_date)')
      .getRawMany();
    const beforeYearData = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .select('DATE(orders.payment_date)', 'payment_date')
      .addSelect(
        'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
        'sales_price',
      )
      .where('orders.payment_date BETWEEN :startDate AND :tomorrow', {
        startDate: DateTime.now()
          .minus({ years: 1, days: 13 })
          .toFormat('yyyy-LL-dd'),
        tomorrow: DateTime.now()
          .minus({ years: 1 })
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('product.brand_id = :brandId', { brandId: brandId })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('DATE(orders.payment_date)')
      .getRawMany();
    return [thisYearData, beforeYearData];
  }
}

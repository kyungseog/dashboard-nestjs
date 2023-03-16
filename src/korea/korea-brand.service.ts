import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Costs } from 'src/entities/costs.entity';

@Injectable()
export class KoreaBrandService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getBrandSales(dateText): Promise<KoreaOrders[][]> {
    const { startDay, endDay } = dateText;
    const marketingFee = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.brand_id', 'brand_id')
      .addSelect('SUM(marketing.cost)', 'cost')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.brand_id')
      .getRawMany();
    const brandSalesData = await this.koreaOrdersRepository
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
      )
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
    const logisticFee = await this.dataSource.query(
      `SELECT tt.brand_id
        , sum(tt.polybag) + sum(tt.logistic_fixed) AS logistic_fee
      FROM (select a.id, b.brand_id, sum(a.quantity) * 52 as polybag, co.logistic_fixed
        from management.korea_orders a
          LEFT JOIN management.products b on a.product_id = b.id
          LEFT JOIN management.brands c on b.brand_id = c.id
          LEFT JOIN management.suppliers d on c.supplier_id = d.id
          LEFT JOIN (
            SELECT a.id, ROUND((2746 + 2100 + 565) / COUNT(a.id)) as logistic_fixed 
            FROM management.korea_orders a
              LEFT JOIN management.products b on a.product_id = b.id
              LEFT JOIN management.brands c on b.brand_id = c.id
              LEFT JOIN management.suppliers d on c.supplier_id = d.id
            WHERE a.payment_date BETWEEN ? AND ?
              AND d.id = '1' 
              AND a.status_id IN ('p1','g1','d1','d2','s1')
            GROUP BY a.id) co ON a.id = co.id
      WHERE a.payment_date BETWEEN ? AND ? 
        AND d.id = '1'
        AND a.status_id IN ('p1','g1','d1','d2','s1')
      GROUP BY a.id, b.brand_id) tt
      group by tt.brand_id `,
      [startDay, endDay, startDay, endDay],
    );
    return [marketingFee, brandSalesData, logisticFee];
  }

  async getBrandDetail(
    brandId: string,
    dateText: string,
  ): Promise<KoreaOrders[][]> {
    let startDay = '';
    if (dateText === 'today') {
      startDay = DateTime.now().toFormat('yyyy-LL-dd');
    } else if (dateText === 'yesterday') {
      startDay = DateTime.now().minus({ days: 1 }).toFormat('yyyy-LL-dd');
    } else if (dateText === 'last_7_days') {
      startDay = DateTime.now().minus({ days: 7 }).toFormat('yyyy-LL-dd');
    } else if (dateText === 'last_14_days') {
      startDay = DateTime.now().minus({ days: 14 }).toFormat('yyyy-LL-dd');
    }

    const marketingFee = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.brand_id', 'brand_id')
      .addSelect('SUM(marketing.cost)', 'cost')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay: startDay,
        endDay:
          dateText == 'today'
            ? DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')
            : DateTime.now().toFormat('yyyy-LL-dd'),
      })
      .andWhere('marketing.brand_id = :brandId', { brandId: brandId })
      .getRawOne();
    const brandSalesData = await this.koreaOrdersRepository
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
      )
      .where('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay: startDay,
        endDay:
          dateText == 'today'
            ? DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')
            : DateTime.now().toFormat('yyyy-LL-dd'),
      })
      .andWhere('product.brand_id = :brandId', { brandId: brandId })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .getRawOne();
    if (!brandSalesData) {
      throw new NotFoundException(`can't find brand detail datas`);
    }
    const itemSalesData = await this.koreaOrdersRepository
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
      )
      .where('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay: startDay,
        endDay:
          dateText == 'today'
            ? DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')
            : DateTime.now().toFormat('yyyy-LL-dd'),
      })
      .andWhere('product.brand_id = :brandId', { brandId: brandId })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('product.id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
    return [marketingFee, brandSalesData, itemSalesData];
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

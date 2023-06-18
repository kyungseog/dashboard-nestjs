import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { DayKoreaBrands } from 'src/entities/day-korea-brands.entity';
import { Products } from 'src/entities/products.entity';
import { Costs } from 'src/entities/costs.entity';
import { ProductEssentialsSales } from 'src/entities/product-essentials-sales.entity';
import { ProductEssentialsProducts } from 'src/entities/product-essentials-products.entity';
import { ProductEssentialsVariants } from 'src/entities/product-essentials-variants.entity';
import { Stocks } from 'src/entities/stocks.entity';

@Injectable()
export class EssentialService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(DayKoreaBrands)
    private dayKoreaBrandsRepository: Repository<DayKoreaBrands>,
    @InjectRepository(ProductEssentialsProducts)
    private productEssentialsProductsRepository: Repository<ProductEssentialsProducts>,
    @InjectRepository(ProductEssentialsVariants)
    private productEssentialsVariantsRepository: Repository<ProductEssentialsVariants>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  salesQuery = this.dayKoreaBrandsRepository
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
    .where('data.brand_id = "B0000CAT"');

  getSalesByPeriod(startDay: string, endDay: string) {
    return this.salesQuery
      .andWhere('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .getRawOne();
  }

  getSalesByHour(startDay: string, endDay: string) {
    return this.koreaOrdersRepository
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
      .addSelect('DAY(orders.payment_date)', 'payment_day')
      .addSelect('HOUR(orders.payment_date)', 'payment_hour')
      .where('product.brand_id = "B0000CAT"')
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .andWhere('orders.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('DAY(payment_date), HOUR(payment_date)')
      .getRawMany();
  }

  getSalesByWeek(startDay: string, endDay: string) {
    return this.salesQuery
      .addSelect('DATE_FORMAT(data.payment_date,"%Y-%v")', 'year_week')
      .addSelect(
        'CONCAT(DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(2-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d")," - ",DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(8-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d"))',
        'date_range',
      )
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('year_week')
      .getRawMany();
  }

  getSalesByMonth(startDay: string, endDay: string) {
    return this.salesQuery
      .addSelect('MONTH(data.payment_date)', 'payment_month')
      .andWhere('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('MONTH(data.payment_date)')
      .getRawMany();
  }

  getSalesByDay(startDay: string, endDay: string) {
    return this.salesQuery
      .addSelect('data.payment_date', 'payment_date')
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('payment_date')
      .getRawMany();
  }

  getProductSalesByStock() {
    return this.dataSource.query(
      `SELECT a.custom_cost_id 
      , a.custom_product_id
      , b.product_name
      , a.color
      , c.first_sale_date
      , a.post_cost
      , a.in_quantity
      , b.usable_quantity 
    FROM management.product_essentials_variants a
      LEFT JOIN management.stocks b ON a.barcode = b.barcode 
      LEFT JOIN management.product_essentials_products c ON a.custom_product_id = c.custom_product_id`,
    );
  }

  getProductSalesBySale(startDay: string, endDay: string) {
    return this.dataSource.query(
      `SELECT a.product_variant_id
    , a.custom_product_id
    , c.custom_cost_id
    , c.custom_variant_id 
    , d.product_custom_name
    , c.color 
    , c.size
    , d.target 
    , d.category 
    , d.season
    , d.material 
    , d.design 
    , d.gender
    , d.style
    , d.plan_year 
    , d.fixed_price 
    , d.sales_price 
    , c.post_cost 
    , d.first_sale_date 
    , b.quantity
    , b.sales
    , b.order_coupon
    , b.product_coupon
  FROM management.product_essentials_sales a
    LEFT JOIN (
      SELECT a.product_variant_id
        , sum(a.quantity) AS quantity
        , sum((a.sale_price - a.discount_price) * a.quantity) AS sales
        , sum(a.order_coupon) AS order_coupon
        , sum(a.product_coupon) AS product_coupon
        , sum(a.mileage) AS mileage
      FROM (
        SELECT product_id , product_variant_id , quantity , sale_price , discount_price, order_coupon, product_coupon, mileage
        FROM management.korea_orders
        WHERE payment_date BETWEEN ? AND ?
          AND user_id != "mmzjapan"
            AND status_id IN ("p1","g1","d1","d2","s1")
          ) a
          LEFT JOIN management.products b ON a.product_id = b.id
      WHERE b.brand_id = "B0000CAT"
      GROUP BY a.product_variant_id
      )b ON a.product_variant_id = b.product_variant_id
    LEFT JOIN management.product_essentials_variants c ON a.barcode = c.barcode
    LEFT JOIN management.product_essentials_products d ON a.custom_product_id = d.custom_product_id`,
      [startDay, endDay],
    );
  }
}

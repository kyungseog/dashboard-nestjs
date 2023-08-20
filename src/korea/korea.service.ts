import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Costs } from 'src/entities/costs.entity';

@Injectable()
export class KoreaService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
  ) {}

  getSalesByDay(startDay: string, endDay: string) {
    return this.koreaOrdersRepository
      .createQueryBuilder()
      .select('DATE(payment_date)', 'payment_date')
      .addSelect('WEEK(payment_date,7)', 'weeks')
      .addSelect('SUM((sale_price - discount_price) * quantity)', 'sales_price')
      .addSelect('COUNT(DISTINCT(id))', 'order_count')
      .where('payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('payment_date != :exceptDate', {
        exceptDate: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd 00:00:00'),
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('user_id != "mmzjapan"')
      .groupBy('DATE(payment_date)')
      .getRawMany();
  }

  getSalesByHour(startDay: string, endDay: string) {
    return this.koreaOrdersRepository
      .createQueryBuilder()
      .select('DAY(payment_date)', 'payment_day')
      .addSelect('HOUR(payment_date)', 'payment_hour')
      .addSelect('SUM((sale_price - discount_price) * quantity)', 'sales_price')
      .addSelect('COUNT(DISTINCT(id))', 'order_count')
      .where('payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('user_id != "mmzjapan"')
      .groupBy('DAY(payment_date), HOUR(payment_date)')
      .getRawMany();
  }

  getSalesByPeriod(startDay: string, endDay: string) {
    return this.koreaOrdersRepository
      .createQueryBuilder()
      .select('SUM((sale_price - discount_price) * quantity)', 'sales_price')
      .addSelect('COUNT(DISTINCT(id))', 'order_count')
      .where('payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('payment_date != :exceptDate', {
        exceptDate: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd 00:00:00'),
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('user_id != "mmzjapan"')
      .getRawOne();
  }

  async getProductSales(
    brandId: string,
    dateText: string,
  ): Promise<KoreaOrders[]> {
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
    let productSalesData = [];
    if (brandId == 'moomooz') {
      productSalesData = await this.koreaOrdersRepository
        .createQueryBuilder('orders')
        .leftJoin(Products, 'product', 'orders.product_id = product.id')
        .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
        .leftJoin(
          Costs,
          'cost',
          'orders.product_variant_id = cost.product_variant_id',
        )
        .select('product.name', 'product_name')
        .addSelect('product.image', 'image')
        .addSelect('brand.id', 'brand_id')
        .addSelect('brand.brand_name', 'brand_name')
        .addSelect('brand.account_type', 'brand_type')
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
        .andWhere('orders.status_id IN (:...ids)', {
          ids: ['p1', 'g1', 'd1', 'd2', 's1'],
        })
        .andWhere('orders.user_id != "mmzjapan"')
        .groupBy('orders.product_id')
        .orderBy('sales_price', 'DESC')
        .getRawMany();
    } else {
      productSalesData = await this.koreaOrdersRepository
        .createQueryBuilder('orders')
        .leftJoin(Products, 'product', 'orders.product_id = product.id')
        .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
        .leftJoin(
          Costs,
          'cost',
          'orders.product_variant_id = cost.product_variant_id',
        )
        .select('product.name', 'product_name')
        .addSelect('product.image', 'image')
        .addSelect('brand.id', 'brand_id')
        .addSelect('brand.brand_name', 'brand_name')
        .addSelect('brand.account_type', 'brand_type')
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
        .andWhere('orders.status_id IN (:...ids)', {
          ids: ['p1', 'g1', 'd1', 'd2', 's1'],
        })
        .andWhere('product.brand_id = :brandId', { brandId: brandId })
        .andWhere('orders.user_id != "mmzjapan"')
        .groupBy('orders.product_id')
        .orderBy('sales_price', 'DESC')
        .getRawMany();
    }
    if (!productSalesData) {
      throw new NotFoundException(`can't find product sales datas`);
    }
    return productSalesData;
  }

  async getPartnerSales(dateText: string): Promise<KoreaOrders[][]> {
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
      .leftJoin(Brands, 'brand', 'marketing.brand_id = brand.id')
      .leftJoin(Suppliers, 'supplier', 'brand.supplier_id = supplier.id')
      .select('supplier.integration_id', 'supplier_id')
      .addSelect('SUM(marketing.cost)', 'cost')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay: startDay,
        endDay:
          dateText == 'today'
            ? DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')
            : DateTime.now().toFormat('yyyy-LL-dd'),
      })
      .groupBy('supplier.integration_id')
      .getRawMany();
    const partnerSalesData = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'supplier', 'brand.supplier_id = supplier.id')
      .leftJoin(
        Costs,
        'cost',
        'orders.product_variant_id = cost.product_variant_id',
      )
      .select('supplier.integration_id', 'supplier_id')
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
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('supplier.integration_id != "1"')
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('supplier.integration_id')
      .orderBy('sales_price', 'DESC')
      .getRawMany();
    if (!partnerSalesData) {
      throw new NotFoundException(`can't find partner sales datas`);
    }
    return [marketingFee, partnerSalesData];
  }
}

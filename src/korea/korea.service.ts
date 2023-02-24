import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaUsers } from 'src/entities/korea-users.entity';

@Injectable()
export class KoreaService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaUsers)
    private koreaUsersRepository: Repository<KoreaUsers>,
  ) {}

  getDate(dates: { today: string; type: string }) {
    const { today, type } = dates;
    const targetDay: string = DateTime.fromISO(today)
      .plus({ days: 1 })
      .toFormat('yyyy-LL-dd');
    const beforeDay: string = DateTime.fromISO(today)
      .minus({ days: Number(type) })
      .toFormat('yyyy-LL-dd');
    return { targetDay, beforeDay };
  }

  async getSales(): Promise<KoreaOrders[]> {
    const today = DateTime.now().toFormat('yyyy-LL-dd');
    const todayData = await this.koreaOrdersRepository
      .createQueryBuilder()
      .select('SUM(sale_price) - SUM(discount_price)', 'sales_price')
      .addSelect('COUNT(DISTINCT(id))', 'order_count')
      .where('DATE(payment_date) = :today', {
        today: today,
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .getRawMany();
    const monthlyData = await this.koreaOrdersRepository
      .createQueryBuilder()
      .select('SUM(sale_price) - SUM(discount_price)', 'sales_price')
      .where('YEAR(payment_date) = :year', {
        year: Number(today.substring(0, 4)),
      })
      .andWhere('MONTH(payment_date) = :month', {
        month: Number(today.substring(5, 7)),
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .getRawOne();
    return [todayData, monthlyData];
  }

  async getChartSales(): Promise<KoreaOrders[][]> {
    const thisYearData = await this.koreaOrdersRepository
      .createQueryBuilder()
      .select('DATE(payment_date)', 'payment_date')
      .addSelect('SUM(sale_price) - SUM(discount_price)', 'sales_price')
      .where('DATE(payment_date) > :startDate', {
        startDate: DateTime.now().minus({ days: 14 }).toFormat('yyyy-LL-dd'),
      })
      .andWhere('DATE(payment_date) <= :today', {
        today: DateTime.now().toFormat('yyyy-LL-dd'),
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .groupBy('DATE(payment_date)')
      .getRawMany();
    const beforeYearData = await this.koreaOrdersRepository
      .createQueryBuilder()
      .select('DATE(payment_date)', 'payment_date')
      .addSelect('SUM(sale_price) - SUM(discount_price)', 'sales_price')
      .where('DATE(payment_date) > :startDate', {
        startDate: DateTime.now()
          .minus({ years: 1, days: 14 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('DATE(payment_date) <= :today', {
        today: DateTime.now().minus({ years: 1 }).toFormat('yyyy-LL-dd'),
      })
      .andWhere('status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .groupBy('DATE(payment_date)')
      .getRawMany();
    return [thisYearData, beforeYearData];
  }

  async getBrandSales(brandSales: {
    today: string;
    type: string;
  }): Promise<KoreaOrders[]> {
    const { targetDay, beforeDay } = this.getDate(brandSales);
    const salesData = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .select('product.brand_id', 'brand_id')
      .addSelect('brand.name', 'brand_name')
      .addSelect('COUNT(DISTINCT(orders.id))', 'order_count')
      .addSelect('SUM(orders.quantity)', 'quantity')
      .addSelect(
        'SUM(orders.sale_price) - SUM(orders.discount_price)',
        'sales_price',
      )
      .addSelect(
        'SUM(orders.mileage) + SUM(orders.order_coupon) + SUM(orders.product_coupon)',
        'cost',
      )
      .addSelect(
        'IF(orders.channel = "shop", ROUND(SUM(orders.sale_price - orders.discount_price - orders.mileage - orders.order_coupon - orders.product_coupon) * 0.032), ROUND(SUM(orders.sale_price - orders.discount_price - orders.mileage - orders.order_coupon - orders.product_coupon) * 0.034))',
        'pg_cost',
      )
      .where('DATE(orders.payment_date) < :targetDay', {
        targetDay: targetDay,
      })
      .andWhere('DATE(orders.payment_date) >= :beforeDay', {
        beforeDay: beforeDay,
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .groupBy('product.brand_id')
      .orderBy('sales_price', 'DESC')
      .limit(6)
      .getRawMany();
    if (!salesData) {
      throw new NotFoundException(`can't find brand sales datas`);
    }
    return salesData;
  }

  async getProductSales(productSales: {
    today: string;
    type: string;
  }): Promise<KoreaOrders[]> {
    const { targetDay, beforeDay } = this.getDate(productSales);
    const salesData = await this.koreaOrdersRepository
      .createQueryBuilder('koreaOrders')
      .leftJoin(Products, 'product', 'koreaOrders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .select('product.name', 'product_name')
      .addSelect('product.image', 'image')
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
      .groupBy('product.id')
      .orderBy('sales_price', 'DESC')
      .limit(6)
      .getRawMany();
    if (!salesData) {
      throw new NotFoundException(`can't find brand sales datas`);
    }
    return salesData;
  }

  async getUsers(): Promise<KoreaUsers[]> {
    const targetDate = DateTime.now().minus({ days: 1 }).toFormat('yyyy-LL-dd');
    const targetDateUsers = await this.koreaUsersRepository
      .createQueryBuilder()
      .select('COUNT(id)', 'target_date_users')
      .where('DATE(created_at) = :today', {
        today: targetDate,
      })
      .getRawOne();
    const monthlyUsers = await this.koreaUsersRepository
      .createQueryBuilder()
      .select('COUNT(id)', 'monthly_users')
      .where('YEAR(created_at) = :year', {
        year: Number(targetDate.substring(0, 4)),
      })
      .andWhere('MONTH(created_at) = :month', {
        month: Number(targetDate.substring(5, 7)),
      })
      .getRawOne();
    const totalUsers = await this.koreaUsersRepository
      .createQueryBuilder()
      .select('COUNT(id)', 'total_users')
      .where('DATE(created_at) <= :today', {
        today: targetDate,
      })
      .getRawOne();
    return [targetDateUsers, monthlyUsers, totalUsers];
  }
}

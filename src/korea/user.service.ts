import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaUsers } from 'src/entities/korea-users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaUsers)
    private koreaUsersRepository: Repository<KoreaUsers>,
  ) {}

  async getUsersByPeriod(startDay: string, endDay: string) {
    return await this.koreaUsersRepository
      .createQueryBuilder()
      .select('COUNT(id)', 'count_users')
      .where('created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .getRawOne();
  }

  async getUsersByDay(startDay: string, endDay: string) {
    return await this.koreaUsersRepository
      .createQueryBuilder()
      .select('DATE(created_at)')
      .select('COUNT(id)', 'count_users')
      .where('created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .groupBy('DATE(created_at)')
      .getRawOne();
  }

  async getUserSaleType(): Promise<KoreaOrders[][]> {
    const thisYearMonth = DateTime.now().toFormat('yyyy-LL');
    const tomorrow = DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd');
    const userSaleTypeSum = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .select('orders.is_first', 'is_first')
      .addSelect('COUNT(DISTINCT(orders.user_id))', 'user_count')
      .addSelect('SUM(orders.quantity)', 'quantity')
      .addSelect(
        'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
        'sales_price',
      )
      .where('orders.payment_date BETWEEN :firstDay AND :tomorrow', {
        firstDay: thisYearMonth + '-01',
        tomorrow: tomorrow,
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('orders.is_first')
      .getRawMany();
    const userSaleTypeData = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .select('product.brand_id', 'brand_id')
      .addSelect('brand.name', 'brand_name')
      .addSelect('orders.is_first', 'is_first')
      .addSelect('COUNT(DISTINCT(orders.user_id))', 'user_count')
      .addSelect('SUM(orders.quantity)', 'quantity')
      .addSelect(
        'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
        'sales_price',
      )
      .where('orders.payment_date BETWEEN :firstDay AND :tomorrow', {
        firstDay: thisYearMonth + '-01',
        tomorrow: tomorrow,
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('orders.is_first')
      .groupBy('product.brand_id')
      .getRawMany();
    if (!userSaleTypeData) {
      throw new NotFoundException(`can't find user sale type datas`);
    }
    return [userSaleTypeSum, userSaleTypeData];
  }
}

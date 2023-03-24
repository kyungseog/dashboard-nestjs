import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { Costs } from 'src/entities/costs.entity';
import { Squads } from 'src/entities/squads.entity';

@Injectable()
export class SquadService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaBudget)
    private koreaBudgetRepository: Repository<KoreaBudget>,
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocaitonFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(LiveCommerces)
    private liveCommercesRepository: Repository<LiveCommerces>,
  ) {}

  async getSales(): Promise<KoreaOrders[][]> {
    const targetDay = DateTime.now().toFormat('yyyy-LL-dd');
    const thisYearMonth = DateTime.now().toFormat('yyyy-LL');
    const tomorrow = DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd');
    const budgetData = await this.koreaBudgetRepository
      .createQueryBuilder('budget')
      .where('YEAR(date) = :year', {
        year: Number(targetDay.substring(0, 4)),
      })
      .andWhere('MONTH(date) = :month', {
        month: Number(targetDay.substring(5, 7)),
      })
      .getRawMany();
    const actualData = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(
        Costs,
        'cost',
        'orders.product_variant_id = cost.product_variant_id',
      )
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('squad.id', 'squad_id')
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
      .where('orders.payment_date BETWEEN :firstDay AND :tomorrow', {
        firstDay: thisYearMonth + '-01',
        tomorrow: tomorrow,
      })
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('squad.id IS NOT NULL')
      .andWhere('orders.user_id != "mmzjapan"')
      .groupBy('squad.id')
      .getRawMany();
    const marketingFee_d = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .leftJoin(Brands, 'brand', 'marketing.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('squad.id', 'squad_id')
      .addSelect('SUM(marketing.cost)', 'cost')
      .where('YEAR(marketing.created_at) = :year', {
        year: Number(targetDay.substring(0, 4)),
      })
      .andWhere('MONTH(marketing.created_at) = :month', {
        month: Number(targetDay.substring(5, 7)),
      })
      .andWhere('squad.id IS NOT NULL')
      .groupBy('squad.id')
      .getRawMany();
    const marketingFee_i = await this.koreaAllocaitonFeesRepository
      .createQueryBuilder('fee')
      .leftJoin(Brands, 'brand', 'fee.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('squad.id', 'squad_id')
      .addSelect('SUM(fee.allocated_fee)', 'indirect_marketing_fee')
      .where('YEAR(fee.created_at) = :year', {
        year: Number(targetDay.substring(0, 4)),
      })
      .andWhere('MONTH(fee.created_at) = :month', {
        month: Number(targetDay.substring(5, 7)),
      })
      .andWhere('fee.account = "marketing"')
      .andWhere('squad.id IS NOT NULL')
      .groupBy('squad.id')
      .getRawMany();
    const marketingFee_live = await this.liveCommercesRepository
      .createQueryBuilder('live')
      .leftJoin(Brands, 'brand', 'live.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('squad.id', 'squad_id')
      .addSelect('SUM(live.cost)', 'live_fee')
      .where('YEAR(live.start_date) = :year', {
        year: Number(targetDay.substring(0, 4)),
      })
      .andWhere('MONTH(live.start_date) = :month', {
        month: Number(targetDay.substring(5, 7)),
      })
      .andWhere('squad.id IS NOT NULL')
      .groupBy('squad.id')
      .getRawMany();
    const logisticFee = await this.koreaAllocaitonFeesRepository
      .createQueryBuilder('fee')
      .leftJoin(Brands, 'brand', 'fee.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('squad.id', 'squad_id')
      .addSelect('SUM(fee.allocated_fee)', 'logistic_fee')
      .where('YEAR(fee.created_at) = :year', {
        year: Number(targetDay.substring(0, 4)),
      })
      .andWhere('MONTH(fee.created_at) = :month', {
        month: Number(targetDay.substring(5, 7)),
      })
      .andWhere('fee.account = "logistic"')
      .andWhere('squad.id IS NOT NULL')
      .groupBy('squad.id')
      .getRawMany();
    return [
      budgetData,
      actualData,
      marketingFee_d,
      marketingFee_i,
      marketingFee_live,
      logisticFee,
    ];
  }

  async getSalesById(
    id: string,
    startDay: string,
    endDay: string,
  ): Promise<{
    budget: any;
    actual: any[];
    directMarketing: any;
    indirectMarketing: any;
    liveMarketing: any;
    logistic: any;
  }> {
    const budget = await this.koreaBudgetRepository
      .createQueryBuilder('budget')
      .select('SUM(budget.sale_sales)', 'sales')
      .where('budget.date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('budget.squad_id = :id', { id })
      .getRawOne();
    const actual = await this.koreaOrdersRepository
      .createQueryBuilder('orders')
      .leftJoin(Products, 'product', 'orders.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(
        Costs,
        'cost',
        'orders.product_variant_id = cost.product_variant_id',
      )
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('DATE(orders.payment_date)', 'payment_date')
      .addSelect('squad.name', 'squad_name')
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
        endDay: DateTime.fromISO(endDay)
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('squad.id = :id', { id })
      .andWhere('orders.user_id != "mmzjapan"')
      .andWhere('orders.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .groupBy('DATE(orders.payment_date)')
      .getRawMany();
    const directMarketing = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .leftJoin(Brands, 'brand', 'marketing.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('SUM(marketing.cost)', 'fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('squad.id = :id', { id })
      .getRawOne();
    const indirectMarketing = await this.koreaAllocaitonFeesRepository
      .createQueryBuilder('fee')
      .leftJoin(Brands, 'brand', 'fee.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('SUM(fee.allocated_fee)', 'fee')
      .where('fee.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('fee.account = "marketing"')
      .andWhere('squad.id = :id', { id })
      .getRawOne();
    const liveMarketing = await this.liveCommercesRepository
      .createQueryBuilder('live')
      .leftJoin(Brands, 'brand', 'live.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('SUM(live.cost)', 'fee')
      .where('live.start_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('squad.id = :id', { id })
      .getRawOne();
    const logistic = await this.koreaAllocaitonFeesRepository
      .createQueryBuilder('fee')
      .leftJoin(Brands, 'brand', 'fee.brand_id = brand.id')
      .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
      .select('SUM(fee.allocated_fee)', 'fee')
      .where('fee.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('fee.account = "logistic"')
      .andWhere('squad.id = :id', { id })
      .getRawOne();
    return {
      budget,
      actual,
      directMarketing,
      indirectMarketing,
      liveMarketing,
      logistic,
    };
  }

  async getBrandsById(id: string): Promise<{ target: any }> {
    const target = 0;
    return { target };
  }

  async getProductsById(id: string, brandId: string): Promise<{ target: any }> {
    const target = 0;
    return { target };
  }
}

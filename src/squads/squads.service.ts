import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaBudget } from 'src/entities/korea-budget.entity';
import { MonthKoreaBrands } from 'src/entities/month-korea-brands.entity';
import { DayKoreaBrands } from 'src/entities/day-korea-brands.entity';
import { Repository } from 'typeorm';
import { Brands } from 'src/entities/brands.entity';
import { Squads } from 'src/entities/squads.entity';

@Injectable()
export class SquadsService {
  constructor(
    @InjectRepository(KoreaBudget)
    private koreaBudgetRepository: Repository<KoreaBudget>,
    @InjectRepository(DayKoreaBrands)
    private dayKoreaBrandsRepository: Repository<DayKoreaBrands>,
    @InjectRepository(MonthKoreaBrands)
    private monthKoreaBrandsRepository: Repository<MonthKoreaBrands>,
  ) {}

  monthSquadQuery = this.monthKoreaBrandsRepository
    .createQueryBuilder('data')
    .leftJoin(Brands, 'brand', 'data.brand_id = brand.id')
    .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
    .select('squad.id', 'squad_id')
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
    .addSelect('SUM(data.contribution_margin)', 'contribution_margin');

  monthBrandQuery = this.monthKoreaBrandsRepository
    .createQueryBuilder('data')
    .leftJoin(Brands, 'brand', 'data.brand_id = brand.id')
    .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
    .select('data.brand_id', 'brand_id')
    .addSelect('data.brand_name', 'brand_name')
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
    .addSelect('SUM(data.contribution_margin)', 'contribution_margin');

  daySquadQuery = this.dayKoreaBrandsRepository
    .createQueryBuilder('data')
    .leftJoin(Brands, 'brand', 'data.brand_id = brand.id')
    .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
    .select('squad.id', 'squad_id')
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
    .addSelect('SUM(data.contribution_margin)', 'contribution_margin');

  dayBrandQuery = this.dayKoreaBrandsRepository
    .createQueryBuilder('data')
    .leftJoin(Brands, 'brand', 'data.brand_id = brand.id')
    .leftJoin(Squads, 'squad', 'brand.squad = squad.name')
    .select('data.brand_id', 'brand_id')
    .addSelect('data.brand_name', 'brand_name')
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
    .addSelect('SUM(data.contribution_margin)', 'contribution_margin');

  getSalesByPeriod(startDay: string, endDay: string) {
    return this.daySquadQuery
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('squad_id')
      .getRawMany();
  }

  getSalesByMonth(startDay: string, endDay: string) {
    return this.monthSquadQuery
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('squad_id')
      .getRawMany();
  }

  getSalesByWeek(startDay: string, endDay: string) {
    return this.daySquadQuery
      .addSelect('DATE_FORMAT(data.payment_date,"%Y-%v")', 'year_week')
      .addSelect(
        'CONCAT(DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(2-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d")," - ",DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(8-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d"))',
        'date_range',
      )
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('year_week, squad_id')
      .getRawMany();
  }

  getSalesByDay(startDay: string, endDay: string) {
    return this.daySquadQuery
      .addSelect('data.payment_date', 'payment_date')
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('payment_date, squad_id')
      .getRawMany();
  }

  getBudget(startDay: string, endDay: string) {
    return this.koreaBudgetRepository
      .createQueryBuilder('budget')
      .where('date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .getRawMany();
  }

  getBrandsByPeriod(id: string, startDay: string, endDay: string) {
    return this.dayBrandQuery
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('squad.id = :id', { id })
      .groupBy('brand_id')
      .getRawMany();
  }

  getBrandsByWeek(id: string, startDay: string, endDay: string) {
    return this.dayBrandQuery
      .addSelect('DATE_FORMAT(data.payment_date,"%Y-%v")', 'year_week')
      .addSelect(
        'CONCAT(DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(2-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d")," - ",DATE_FORMAT(DATE_ADD(data.payment_date, INTERVAL(8-DAYOFWEEK(data.payment_date)) DAY),"%Y/%m/%d"))',
        'date_range',
      )
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('squad.id = :id', { id })
      .groupBy('year_week, brand_id')
      .getRawMany();
  }

  getBrandsByDay(id: string, startDay: string, endDay: string) {
    return this.dayBrandQuery
      .addSelect('data.payment_date', 'payment_date')
      .where('data.payment_date BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('squad.id = :id', { id })
      .groupBy('payment_date, brand_id')
      .getRawMany();
  }
}

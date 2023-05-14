import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';

@Injectable()
export class LogisticService {
  constructor(
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocaitonFeesRepository: Repository<KoreaAllocationFees>,
  ) {}

  logisticQuery = this.koreaAllocaitonFeesRepository
    .createQueryBuilder('logistic')
    .select('logistic.brand_id', 'brand_id')
    .addSelect('SUM(logistic.allocated_fee)', 'logistic_fee')
    .where('logistic.account = "logistic"');

  getFeeByPeriod(startDay: string, endDay: string) {
    return this.koreaAllocaitonFeesRepository
      .createQueryBuilder('logistic')
      .select('SUM(logistic.allocated_fee)', 'logistic_fee')
      .where('logistic.account = "logistic"')
      .andWhere('logistic.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .getRawOne();
  }

  getFeeByDay(startDay: string, endDay: string) {
    return this.koreaAllocaitonFeesRepository
      .createQueryBuilder('logistic')
      .select('logistic.created_at', 'created_at')
      .addSelect('SUM(logistic.allocated_fee)', 'logistic_fee')
      .where('logistic.account = "logistic"')
      .andWhere('logistic.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('logistic.created_at')
      .getRawMany();
  }

  getFeeByBrandPeriod(startDay: string, endDay: string) {
    return this.logisticQuery
      .andWhere('logistic.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('logistic.brand_id')
      .getRawMany();
  }

  getFeeByBrandDay(startDay: string, endDay: string) {
    return this.logisticQuery
      .addSelect('logistic.created_at', 'created_at')
      .andWhere('logistic.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('logistic.brand_id, logistic.created_at')
      .getRawMany();
  }

  getFeeByBrandMonth(startDay: string, endDay: string) {
    return this.logisticQuery
      .addSelect('MONTH(logistic.created_at)', 'month')
      .andWhere('logistic.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('logistic.brand_id, MONTH(logistic.created_at)')
      .getRawMany();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocaitonFeesRepository: Repository<KoreaAllocationFees>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  directQuery = this.koreaMarketingRepository
    .createQueryBuilder('marketing')
    .select('marketing.created_at', 'created_at')
    .addSelect('marketing.brand_id', 'brand_id')
    .addSelect('SUM(marketing.cost)', 'direct_marketing_fee');

  indirectQuery = this.koreaAllocaitonFeesRepository
    .createQueryBuilder('marketing')
    .select('marketing.created_at', 'created_at')
    .addSelect('marketing.brand_id', 'brand_id')
    .addSelect('SUM(marketing.allocated_fee)', 'indirect_marketing_fee');

  getFeeByDay(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.created_at', 'created_at')
      .addSelect('SUM(marketing.cost)', 'marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.created_at')
      .getRawMany();
  }

  getFeeByPeriod(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('SUM(marketing.cost)', 'marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .getRawOne();
  }

  getDirectByBrandDay(startDay: string, endDay: string) {
    return this.directQuery
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.brand_id, marketing.created_at')
      .getRawMany();
  }

  getDirectByBrandPeriod(startDay: string, endDay: string) {
    return this.directQuery
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.brand_id')
      .getRawMany();
  }

  getIndirectByDay(startDay: string, endDay: string) {
    return this.koreaAllocaitonFeesRepository
      .createQueryBuilder('marketing')
      .select('marketing.created_at', 'created_at')
      .addSelect('SUM(marketing.allocated_fee)', 'indirect_marketing_fee')
      .where('marketing.account = "marketing"')
      .andWhere('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.created_at')
      .getRawMany();
  }

  getIndirectByPeriod(startDay: string, endDay: string) {
    return this.koreaAllocaitonFeesRepository
      .createQueryBuilder('marketing')
      .select('SUM(marketing.allocated_fee)', 'indirect_marketing_fee')
      .where('marketing.account = "marketing"')
      .andWhere('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .getRawOne();
  }

  getIndirectByBrandDay(startDay: string, endDay: string) {
    return this.indirectQuery
      .where('marketing.account = "marketing"')
      .andWhere('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.brand_id, marketing.created_at')
      .getRawMany();
  }

  getIndirectByBrandPeriod(startDay: string, endDay: string) {
    return this.indirectQuery
      .where('marketing.account = "marketing"')
      .andWhere('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.brand_id')
      .getRawMany();
  }

  getChannelByPeriod(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.channel', 'channel')
      .addSelect('SUM(marketing.cost)', 'marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.channel')
      .getRawMany();
  }

  getChannelByDay(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.created_at', 'created_at')
      .addSelect('marketing.channel', 'channel')
      .addSelect('SUM(marketing.cost)', 'marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.created_at, marketing.channel')
      .getRawMany();
  }

  getBrandChannelByPeriod(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.brand_id', 'brand_id')
      .addSelect('marketing.channel', 'channel')
      .addSelect('SUM(marketing.cost)', 'marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.brand_id, marketing.channel')
      .getRawMany();
  }

  getBrandChannelByDay(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.created_at', 'created_at')
      .addSelect('marketing.brand_id', 'brand_id')
      .addSelect('marketing.channel', 'channel')
      .addSelect('SUM(marketing.cost)', 'marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.created_at, marketing.brand_id, marketing.channel')
      .getRawMany();
  }
}

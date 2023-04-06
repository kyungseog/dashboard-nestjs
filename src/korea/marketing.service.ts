import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocaitonFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(LiveCommerces)
    private liveCommercesRepository: Repository<LiveCommerces>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  getDirectMarketingFee(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.created_at', 'created_at')
      .addSelect('marketing.brand_id', 'brand_id')
      .addSelect('SUM(marketing.cost)', 'direct_marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.created_at, marketing.brand_id')
      .getRawMany();
  }

  getDirectMarketingFeeByBrand(startDay: string, endDay: string) {
    return this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.created_at', 'created_at')
      .addSelect('marketing.brand_id', 'brand_id')
      .addSelect('marketing.channel', 'channel')
      .addSelect('SUM(marketing.cost)', 'direct_marketing_fee')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .groupBy('marketing.created_at, marketing.brand_id, marketing.channel')
      .getRawMany();
  }

  getIndirectMarketingFee(startDay: string, endDay: string) {
    return this.koreaAllocaitonFeesRepository
      .createQueryBuilder('fee')
      .select('fee.created_at', 'created_at')
      .addSelect('fee.brand_id', 'brand_id')
      .addSelect('SUM(fee.allocated_fee)', 'indirect_marketing_fee')
      .where('fee.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('fee.account = "marketing"')
      .groupBy('fee.created_at, fee.brand_id')
      .getRawMany();
  }

  getLiveMarketingFee(startDay: string) {
    return this.liveCommercesRepository
      .createQueryBuilder('live')
      .select('DATE(live.start_date)', 'created_at')
      .select('live.brand_id', 'brand_id')
      .addSelect('SUM(live.cost)', 'live_fee')
      .where('live.start_date = :startDay', { startDay })
      .groupBy('DATE(live.start_date), live.brand_id')
      .getRawMany();
  }

  getMarketingFeeByChannel(startDay: string, endDay: string) {
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
}

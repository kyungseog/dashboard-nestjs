import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';

@Injectable()
export class KoreaMarketingService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocaitonFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(LiveCommerces)
    private liveCommercesRepository: Repository<LiveCommerces>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getMarketingSalesBy(): Promise<{
    byChannel: any[];
    byType: any[];
  }> {
    const targetDate = DateTime.now().toFormat('yyyy-LL-dd');
    const byChannel = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('marketing.channel', 'channel')
      .addSelect('SUM(marketing.cost)', 'cost')
      .addSelect('SUM(marketing.conversion)', 'conversion')
      .where('YEAR(marketing.created_at) = :year', {
        year: Number(targetDate.substring(0, 4)),
      })
      .andWhere('MONTH(marketing.created_at) = :month', {
        month: Number(targetDate.substring(5, 7)),
      })
      .groupBy('marketing.channel')
      .getRawMany();
    const byType = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .leftJoin(Brands, 'brand', 'marketing.brand_id = brand.id')
      .select('brand.id', 'brand_id')
      .addSelect('brand.name', 'brand_name')
      .addSelect('SUM(marketing.cost)', 'cost')
      .addSelect('SUM(marketing.conversion)', 'conversion')
      .where('YEAR(marketing.created_at) = :year', {
        year: Number(targetDate.substring(0, 4)),
      })
      .andWhere('MONTH(marketing.created_at) = :month', {
        month: Number(targetDate.substring(5, 7)),
      })
      .groupBy('marketing.brand_id')
      .getRawMany();
    return { byChannel, byType };
  }

  async getMarketingYearly(): Promise<{
    totalMarketingFee: any;
    totalSales: any;
  }> {
    const targetDate = DateTime.now().toFormat('yyyy-LL-dd');
    const totalMarketingFee = await this.koreaMarketingRepository
      .createQueryBuilder('marketing')
      .select('SUM(marketing.cost)', 'cost')
      .where('marketing.created_at BETWEEN :startDay AND :endDay', {
        startDay: DateTime.now().startOf('year').toFormat('yyyy-LL-dd'),
        endDay: targetDate,
      })
      .getRawOne();
    const totalSales = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .select(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('order.payment_date BETWEEN :startDay AND :endDay', {
        startDay: DateTime.now().startOf('year').toFormat('yyyy-LL-dd'),
        endDay: targetDate,
      })
      .andWhere('order.user_id != "mmzjapan"')
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .getRawOne();
    return { totalMarketingFee, totalSales };
  }
}

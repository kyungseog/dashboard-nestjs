import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Brands } from 'src/entities/brands.entity';

@Injectable()
export class LiveCommercesService {
  constructor(
    @InjectRepository(LiveCommerces)
    private liveCommerceRepository: Repository<LiveCommerces>,
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
  ) {}

  async getLiveCommerce(start_date: Date): Promise<LiveCommerces> {
    const found = await this.liveCommerceRepository
      .createQueryBuilder('live')
      .leftJoinAndSelect(Brands, 'brands', 'live.brand_id = brands.id')
      .where('live.start_date = :start_date', { start_date: start_date })
      .getOne();
    if (!found) {
      throw new NotFoundException(`can't find Live Commerce Data`);
    }
    return found;
  }

  async getLiveSales(liveSales): Promise<KoreaOrders[]> {
    const { brand_id, start_datetime, end_datetime } = liveSales;
    const salesData = await this.koreaOrdersRepository.findBy({
      brand_id: brand_id,
      payment_date: Between(start_datetime, end_datetime),
    });
    if (!salesData) {
      throw new NotFoundException(`can't find live sales datas`);
    }
    return salesData;
  }
}

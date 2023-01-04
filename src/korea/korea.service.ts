import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class KoreaService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
  ) {}

  async getSales(sales): Promise<KoreaOrders[]> {
    const { start_date, end_date } = sales;
    const salesData = await this.koreaOrdersRepository.findBy({
      payment_date: Between(start_date, end_date),
    });
    if (!salesData) {
      throw new NotFoundException(`can't find live sales datas`);
    }
    return salesData;
  }
}

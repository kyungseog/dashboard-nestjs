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

  getLogisticFee(startDay: string, endDay: string) {
    return this.koreaAllocaitonFeesRepository
      .createQueryBuilder('fee')
      .select('fee.created_at', 'created_at')
      .addSelect('fee.brand_id', 'brand_id')
      .addSelect('SUM(fee.allocated_fee)', 'logistic_fee')
      .where('fee.created_at BETWEEN :startDay AND :endDay', {
        startDay,
        endDay,
      })
      .andWhere('fee.account = "logistic"')
      .groupBy('fee.created_at, fee.brand_id')
      .getRawMany();
  }
}

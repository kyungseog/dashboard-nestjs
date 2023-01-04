import { Controller, Get, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaService } from './korea.service';

@Controller('korea')
export class KoreaController {
  constructor(private koreaService: KoreaService) {}

  @Get('/sales')
  getSales(@Query() sales): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(sales);
  }
}

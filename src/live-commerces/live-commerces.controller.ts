import { Controller, Get, Param, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { LiveCommercesService } from './live-commerces.service';

@Controller('live')
export class LiveCommercesController {
  constructor(private liveCommercesService: LiveCommercesService) {}

  @Get('/sales')
  getLiveSales(@Query() liveSales): Promise<KoreaOrders[]> {
    return this.liveCommercesService.getLiveSales(liveSales);
  }

  @Get('/:start_date')
  getLiveCommerce(@Param('start_date') start_date: Date): Promise<KoreaLives> {
    return this.liveCommercesService.getLiveCommerce(start_date);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { LiveCommercesService } from './live-commerces.service';

@Controller('live-commerces')
export class LiveCommercesController {
  constructor(private liveCommercesService: LiveCommercesService) {}

  @Get('/:start_date')
  getWeather(@Param('start_date') start_date: Date): Promise<LiveCommerces> {
    return this.liveCommercesService.getLiveCommerce(start_date);
  }

  @Get('/sales')
  getLiveSales(@Query() liveSales): Promise<KoreaOrders[]> {
    return this.liveCommercesService.getLiveSales(liveSales);
  }
}

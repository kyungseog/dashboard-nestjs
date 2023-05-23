import { Controller, Get, Param, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { SquadsService } from './squads.service';

@Controller('squads')
export class SquadsController {
  constructor(private squadsService: SquadsService) {}

  @Get('/sales')
  getSales(): Promise<KoreaOrders[][]> {
    return this.squadsService.getSales();
  }

  @Get('/:id/sales')
  getSalesById(
    @Param('id') id: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<{
    budget: any;
    actual: any[];
    directMarketing: any;
    indirectMarketing: any;
    liveMarketing: any;
    logistic: any;
  }> {
    return this.squadsService.getSalesById(id, startDay, endDay);
  }

  @Get('/:id/brands')
  getBrandsById(
    @Param('id') id: string,
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return this.squadsService.getBrandsByPeriod(id, startDay, endDay);
    } else if (sumType === 'week') {
      return this.squadsService.getBrandsByWeek(id, startDay, endDay);
    } else {
      return this.squadsService.getBrandsByDay(id, startDay, endDay);
    }
  }

  @Get('/:id/:brandId/products')
  getProductsById(
    @Param('id') id: string,
    @Param('brandId') brandId: string,
  ): Promise<{ target: any }> {
    return this.squadsService.getProductsById(id, brandId);
  }
}

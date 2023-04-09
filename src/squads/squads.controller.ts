import { Controller, Get, Param, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { SquadsService } from './squads.service';

@Controller('squads')
export class SquadsController {
  constructor(private koreaService: SquadsService) {}

  @Get('/sales')
  getSales(): Promise<KoreaOrders[][]> {
    return this.koreaService.getSales();
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
    return this.koreaService.getSalesById(id, startDay, endDay);
  }

  @Get('/:id/brands')
  getBrandsById(@Param('id') id: string): Promise<{ target: any }> {
    return this.koreaService.getBrandsById(id);
  }

  @Get('/:id/:brandId/products')
  getProductsById(
    @Param('id') id: string,
    @Param('brandId') brandId: string,
  ): Promise<{ target: any }> {
    return this.koreaService.getProductsById(id, brandId);
  }
}

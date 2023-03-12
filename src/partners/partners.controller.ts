import { Controller, Get, Param } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get('/sales/:partnerId')
  getSales(@Param('partnerId') partnerId: string): Promise<KoreaOrders[]> {
    return this.partnersService.getSales(partnerId);
  }

  @Get('/yearly-sales/:partnerId')
  getYearlySales(
    @Param('partnerId') partnerId: string,
  ): Promise<KoreaOrders[]> {
    return this.partnersService.getYearlySales(partnerId);
  }

  @Get('/chart-sales/:partnerId')
  getChartSales(
    @Param('partnerId') partnerId: string,
  ): Promise<KoreaOrders[][]> {
    return this.partnersService.getChartSales(partnerId);
  }

  @Get('/product-sales/:partnerId/:dateText')
  getProductSales(
    @Param('partnerId') partnerId: string,
    @Param('dateText') dateText: string,
  ): Promise<KoreaOrders[]> {
    return this.partnersService.getProductSales(partnerId, dateText);
  }
}

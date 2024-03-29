import { Controller, Get, Query } from '@nestjs/common';
import { EssentialService } from './mmz-essential.service';

@Controller('mmz-essential')
export class EssentialController {
  constructor(private essentialService: EssentialService) {}

  @Get('/sales')
  async getSales(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'day') {
      return await this.essentialService.getSalesByDay(startDay, endDay);
    } else if (sumType === 'hour') {
      return await this.essentialService.getSalesByHour(startDay, endDay);
    } else if (sumType === 'week') {
      return await this.essentialService.getSalesByWeek(startDay, endDay);
    } else if (sumType === 'month') {
      return await this.essentialService.getSalesByMonth(startDay, endDay);
    } else {
      return await this.essentialService.getSalesByPeriod(startDay, endDay);
    }
  }

  @Get('/product')
  async getProductSales(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'stock') {
      return await this.essentialService.getProductSalesByStock();
    } else {
      return await this.essentialService.getProductSalesBySale(
        startDay,
        endDay,
      );
    }
  }
}

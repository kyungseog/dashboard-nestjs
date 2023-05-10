import { Controller, Get, Param, Query } from '@nestjs/common';
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
    if (sumType === 'period' || sumType == undefined) {
      return await this.essentialService.getSalesByPeriod(startDay, endDay);
    } else if (sumType === 'hour') {
      return await this.essentialService.getSalesByHour(startDay, endDay);
    } else {
      return await this.essentialService.getSalesByDay(startDay, endDay);
    }
  }

  @Get('/product')
  async getProductSalesTest(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.essentialService.getProductSalesPeriod(
        startDay,
        endDay,
      );
    } else if (sumType === 'hour') {
      return await this.essentialService.getProductSalesHour(startDay, endDay);
    } else if (sumType === 'hourPeriod') {
      return await this.essentialService.getProductSalesHourPeriod(
        startDay,
        endDay,
      );
    } else {
      return await this.essentialService.getProductSalesDay(startDay, endDay);
    }
  }
}

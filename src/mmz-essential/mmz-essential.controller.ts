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

  @Get('/season')
  async getSeasonSales(
    @Query('planYear') planYear: string,
    @Query('season') season: string,
  ): Promise<object> {
    return await this.essentialService.getSeasonSales(planYear, season);
  }

  @Get('/category')
  async getCategorySales(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    return await this.essentialService.getCategorySales(startDay, endDay);
  }

  @Get('/product')
  async getProductSales(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    return await this.essentialService.getProductSales(startDay, endDay);
  }
}

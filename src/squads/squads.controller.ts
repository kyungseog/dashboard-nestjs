import { Controller, Get, Param, Query } from '@nestjs/common';
import { SquadsService } from './squads.service';

@Controller('squads')
export class SquadsController {
  constructor(private squadsService: SquadsService) {}

  @Get('/sales')
  getSales(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return this.squadsService.getSalesByPeriod(startDay, endDay);
    } else if (sumType === 'month') {
      return this.squadsService.getSalesByMonth(startDay, endDay);
    } else if (sumType === 'week') {
      return this.squadsService.getSalesByWeek(startDay, endDay);
    } else {
      return this.squadsService.getSalesByDay(startDay, endDay);
    }
  }

  @Get('/budget')
  getBudget(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    return this.squadsService.getBudget(startDay, endDay);
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
}

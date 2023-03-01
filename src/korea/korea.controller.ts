import { Controller, Get, Param } from '@nestjs/common';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { KoreaService } from './korea.service';

@Controller('korea')
export class KoreaController {
  constructor(private koreaService: KoreaService) {}

  @Get('/sales')
  getSales(): Promise<KoreaOrders[]> {
    return this.koreaService.getSales();
  }

  @Get('/chart-sales')
  getChartSales(): Promise<KoreaOrders[][]> {
    return this.koreaService.getChartSales();
  }

  @Get('/brand-sales/:dateText')
  getBrandSales(@Param('dateText') dateText: string): Promise<KoreaOrders[][]> {
    return this.koreaService.getBrandSales(dateText);
  }

  @Get('/product-sales/:dateText')
  getProductSales(@Param('dateText') dateText: string): Promise<KoreaOrders[]> {
    return this.koreaService.getProductSales(dateText);
  }

  @Get('/marketing')
  getMarketing(): Promise<KoreaMarketing[][]> {
    return this.koreaService.getMarketing();
  }

  @Get('/users')
  getUsers(): Promise<KoreaUsers[]> {
    return this.koreaService.getUsers();
  }

  @Get('/user-sale-type')
  getUserSaleType(): Promise<KoreaOrders[][]> {
    return this.koreaService.getUserSaleType();
  }

  // @Get('/salesWeight')
  // getSalesWeight(@Query() salesWeight): Promise<KoreaOrders[]> {
  //   return this.koreaService.getSales(salesWeight);
  // }

  // @Get('/categorySalesWeight')
  // getCategorySalesWeight(@Query() categorysalesWeight): Promise<KoreaOrders[]> {
  //   return this.koreaService.getSales(categorysalesWeight);
  // }

  // @Get('/ageSalesWeight')
  // getAgeSalesWeight(@Query() ageSalesWeight): Promise<KoreaOrders[]> {
  //   return this.koreaService.getSales(ageSalesWeight);
  // }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get('/squad-sales')
  getSquadSales(): Promise<KoreaOrders[][]> {
    return this.koreaService.getSquadSales();
  }

  @Get('/brand-sales')
  getBrandSales(@Query() dateText): Promise<KoreaOrders[][]> {
    return this.koreaService.getBrandSales(dateText);
  }

  @Get('/brand-chart-sales/:brandId')
  getBrandChartSales(
    @Param('brandId') brandId: string,
  ): Promise<KoreaOrders[][]> {
    return this.koreaService.getBrandChartSales(brandId);
  }

  @Get('/brand-sales-detail/:brandId/:dateText')
  getBrandDetail(
    @Param('brandId') brandId: string,
    @Param('dateText') dateText: string,
  ): Promise<KoreaOrders[][]> {
    return this.koreaService.getBrandDetail(brandId, dateText);
  }

  @Get('/product-sales/:brandId/:dateText')
  getProductSales(
    @Param('brandId') brandId: string,
    @Param('dateText') dateText: string,
  ): Promise<KoreaOrders[]> {
    return this.koreaService.getProductSales(brandId, dateText);
  }

  @Get('/partner-sales/:dateText')
  getPartnerSales(
    @Param('dateText') dateText: string,
  ): Promise<KoreaOrders[][]> {
    return this.koreaService.getPartnerSales(dateText);
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

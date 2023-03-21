import { Controller, Get, Param, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { KoreaService } from './korea.service';
import { KoreaBrandService } from './korea-brand.service';
import { KoreaMarketingService } from './korea-marketing.service';

@Controller('korea')
export class KoreaController {
  constructor(
    private koreaService: KoreaService,
    private koreaBrandService: KoreaBrandService,
    private koreaMarketingService: KoreaMarketingService,
  ) {}

  @Get('/sales')
  getSales(): Promise<KoreaOrders[]> {
    return this.koreaService.getSales();
  }

  @Get('/chart-sales')
  getChartSales(): Promise<KoreaOrders[][]> {
    return this.koreaService.getChartSales();
  }

  @Get('/brand-sales')
  getBrandSales(@Query() dateText): Promise<KoreaOrders[][]> {
    return this.koreaBrandService.getBrandSales(dateText);
  }

  @Get('/brand-chart-sales/:brandId')
  getBrandChartSales(
    @Param('brandId') brandId: string,
  ): Promise<KoreaOrders[][]> {
    return this.koreaBrandService.getBrandChartSales(brandId);
  }

  @Get('/brand-sales-detail/:brandId/:dateText')
  getBrandDetail(
    @Param('brandId') brandId: string,
    @Param('dateText') dateText: string,
  ): Promise<KoreaOrders[][]> {
    return this.koreaBrandService.getBrandDetail(brandId, dateText);
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

  @Get('/marketing/salesBy')
  getMarketingSalesBy(): Promise<{ byChannel: any[]; byType: any[] }> {
    return this.koreaMarketingService.getMarketingSalesBy();
  }

  @Get('/marketing/yearly')
  getMarketingYearly(): Promise<{ totalMarketingFee: any; totalSales: any }> {
    return this.koreaMarketingService.getMarketingYearly();
  }

  @Get('/users')
  getUsers(): Promise<KoreaUsers[]> {
    return this.koreaService.getUsers();
  }

  @Get('/user-sale-type')
  getUserSaleType(): Promise<KoreaOrders[][]> {
    return this.koreaService.getUserSaleType();
  }
}

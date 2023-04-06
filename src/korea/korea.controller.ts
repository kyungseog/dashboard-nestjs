import { Controller, Get, Param, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { KoreaService } from './korea.service';
import { KoreaBrandService } from './korea-brand.service';
import { KoreaMarketingService } from './korea-marketing.service';
import { MarketingService } from './marketing.service';
import { BrandService } from './brand.service';
import { ProductService } from './product.service';
import { LogisticService } from './logistic.service';

@Controller('korea')
export class KoreaController {
  constructor(
    private koreaService: KoreaService,
    private koreaBrandService: KoreaBrandService,
    private koreaMarketingService: KoreaMarketingService,
    private marketingService: MarketingService,
    private brandService: BrandService,
    private productService: ProductService,
    private logisticService: LogisticService,
  ) {}

  @Get('/sales')
  getSales(): Promise<KoreaOrders[]> {
    return this.koreaService.getSales();
  }

  @Get('/sales/monthly')
  async getSalesByMonthly(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<any[]> {
    return await this.koreaService.getSalesByMonthly(startDay, endDay);
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

  @Get('/marketing')
  async getMarketingFee(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    const directMarketingFee =
      await this.marketingService.getDirectMarketingFee(startDay, endDay);
    const indirectMarketingFee =
      await this.marketingService.getIndirectMarketingFee(startDay, endDay);
    const liveMarketingFee = await this.marketingService.getLiveMarketingFee(
      startDay,
    );
    return { directMarketingFee, indirectMarketingFee, liveMarketingFee };
  }

  @Get('/marketing/channel')
  async getMarketingFeeByChannel(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<any[]> {
    return await this.marketingService.getMarketingFeeByChannel(
      startDay,
      endDay,
    );
  }

  @Get('/marketing/brand')
  async getMarketingFeeByBrand(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    const directMarketingFeeByBrand =
      await this.marketingService.getDirectMarketingFeeByBrand(
        startDay,
        endDay,
      );
    const indirectMarketingFee =
      await this.marketingService.getIndirectMarketingFee(startDay, endDay);
    const liveMarketingFee = await this.marketingService.getLiveMarketingFee(
      startDay,
    );
    return {
      directMarketingFeeByBrand,
      indirectMarketingFee,
      liveMarketingFee,
    };
  }

  @Get('/brand')
  async getBrandSalesTest(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    const brandSales = await this.brandService.getBrandSales(startDay, endDay);
    const productSalesByBrand = await this.brandService.getProductSalesByBrand(
      startDay,
      endDay,
    );
    return { brandSales, productSalesByBrand };
  }

  @Get('/product')
  async getProductSalesTest(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    const productSales = await this.productService.getProductSales(
      startDay,
      endDay,
    );
    return { productSales };
  }

  @Get('/logistic')
  async getLogisticFee(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    const logisticFee = await this.logisticService.getLogisticFee(
      startDay,
      endDay,
    );
    return { logisticFee };
  }
}

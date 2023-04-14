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
import { UserService } from './user.service';

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
    private userService: UserService,
  ) {}

  @Get('/sales')
  async getSales(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.koreaService.getSalesByPeriod(startDay, endDay);
    } else if (sumType === 'hour') {
      return await this.koreaService.getSalesByHour(startDay, endDay);
    } else {
      return await this.koreaService.getSalesByDay(startDay, endDay);
    }
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

  @Get('/users')
  async getUsers(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.userService.getUsersByPeriod(startDay, endDay);
    } else {
      return await this.userService.getUsersByDay(startDay, endDay);
    }
  }

  @Get('/user-sale-type')
  getUserSaleType(): Promise<KoreaOrders[][]> {
    return this.userService.getUserSaleType();
  }

  @Get('/marketing')
  async getMarketingFee(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.marketingService.getFeeByPeriod(startDay, endDay);
    } else {
      return await this.marketingService.getFeeByDay(startDay, endDay);
    }
  }

  @Get('/marketing/indirect')
  async getIndirectMarketingFee(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.marketingService.getIndirectByPeriod(startDay, endDay);
    } else {
      return await this.marketingService.getIndirectByDay(startDay, endDay);
    }
  }

  @Get('/marketing/channel')
  async getMarketingFeeByChannel(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.marketingService.getChannelByPeriod(startDay, endDay);
    } else {
      return await this.marketingService.getChannelByDay(startDay, endDay);
    }
  }

  @Get('/marketing/brand')
  async getMarketingByBrand(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      const direct = await this.marketingService.getDirectByBrandPeriod(
        startDay,
        endDay,
      );
      const indirect = await this.marketingService.getIndirectByBrandPeriod(
        startDay,
        endDay,
      );
      return {
        direct,
        indirect,
      };
    } else {
      const direct = await this.marketingService.getDirectByBrandDay(
        startDay,
        endDay,
      );
      const indirect = await this.marketingService.getIndirectByBrandDay(
        startDay,
        endDay,
      );
      return {
        direct,
        indirect,
      };
    }
  }

  @Get('/marketing/brand-channel')
  async getMarketingFeeByBrandChannel(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.marketingService.getBrandChannelByPeriod(
        startDay,
        endDay,
      );
    } else {
      return await this.marketingService.getBrandChannelByDay(startDay, endDay);
    }
  }

  @Get('/brand')
  async getBrandSales(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.brandService.getSalesByPeriod(startDay, endDay);
    } else {
      return await this.brandService.getSalesByDay(startDay, endDay);
    }
  }

  @Get('/brand/product')
  async getProductSalesByBrand(
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    return await this.brandService.getProductSalesByBrand(startDay, endDay);
  }

  @Get('/brand/marketing')
  async getBrandByMarketing(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    return await this.getMarketingByBrand(sumType, startDay, endDay);
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
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.logisticService.getFeeByPeriod(startDay, endDay);
    } else {
      return await this.logisticService.getFeeByDay(startDay, endDay);
    }
  }

  @Get('/logistic/brand')
  async getLogisticByBrand(
    @Query('sumType') sumType: string,
    @Query('startDay') startDay: string,
    @Query('endDay') endDay: string,
  ): Promise<object> {
    if (sumType === 'period' || sumType == undefined) {
      return await this.logisticService.getFeeByBrandPeriod(startDay, endDay);
    } else {
      return await this.logisticService.getFeeByBrandDay(startDay, endDay);
    }
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaService } from './korea.service';

@Controller('korea')
export class KoreaController {
  constructor(private koreaService: KoreaService) {}

  @Get('/sales')
  getSales(@Query() sales): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(sales);
  }

  @Get('/brand-sales')
  getBrandSales(@Query() brandSales): Promise<KoreaOrders[]> {
    return this.koreaService.getBrandSales(brandSales);
  }

  @Get('/product-sales')
  getProductSales(@Query() productSales): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(productSales);
  }

  @Get('/salesWeight')
  getSalesWeight(@Query() salesWeight): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(salesWeight);
  }

  @Get('/categorySalesWeight')
  getCategorySalesWeight(@Query() categorysalesWeight): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(categorysalesWeight);
  }

  @Get('/ageSalesWeight')
  getAgeSalesWeight(@Query() ageSalesWeight): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(ageSalesWeight);
  }
}

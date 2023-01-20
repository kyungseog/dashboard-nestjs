import { Controller, Get, Query } from '@nestjs/common';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { KoreaService } from './korea.service';

@Controller('korea')
export class KoreaController {
  constructor(private koreaService: KoreaService) {}

  @Get('/sales')
  getSales(
    @Query() sales: { today: string; type: string },
  ): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(sales);
  }

  @Get('/brand-sales')
  getBrandSales(
    @Query() brandSales: { today: string; type: string },
  ): Promise<KoreaOrders[]> {
    return this.koreaService.getBrandSales(brandSales);
  }

  @Get('/product-sales')
  getProductSales(
    @Query() productSales: { today: string; type: string },
  ): Promise<KoreaOrders[]> {
    return this.koreaService.getProductSales(productSales);
  }

  @Get('/users')
  getUsers(@Query() users): Promise<KoreaOrders[]> {
    return this.koreaService.getSales(users);
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

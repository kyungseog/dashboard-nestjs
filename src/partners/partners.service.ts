import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Suppliers } from 'src/entities/suppliers.entity';
import { Costs } from 'src/entities/costs.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,
    @InjectRepository(Suppliers)
    private suppliersRepository: Repository<Suppliers>,
  ) {}

  async getSales(partnerId: string): Promise<KoreaOrders[]> {
    const partnerInfo = await this.suppliersRepository.findOneBy({
      integration_id: partnerId,
    });
    const brandList = await this.brandsRepository
      .createQueryBuilder('brand')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select('brand.brand_name', 'brand_name')
      .addSelect('brand.created_at', 'created_at')
      .where('partner.integration_id = :partnerId', { partnerId: partnerId })
      .orderBy('brand.created_at')
      .getRawMany();
    const beforeMonthlyData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoin(Products, 'product', 'order.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('order.payment_date BETWEEN :firstDay AND :tomorrow', {
        firstDay:
          DateTime.now().minus({ years: 1 }).toFormat('yyyy-LL') + '-01',
        tomorrow: DateTime.now()
          .minus({ years: 1 })
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('partner.integration_id = :partnerId', { partnerId: partnerId })
      .getRawOne();
    const thisMonthlyData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoin(Products, 'product', 'order.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('order.payment_date BETWEEN :firstDay AND :tomorrow', {
        firstDay: DateTime.now().toFormat('yyyy-LL') + '-01',
        tomorrow: DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd'),
      })
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('partner.integration_id = :partnerId', { partnerId: partnerId })
      .getRawOne();
    return [partnerInfo, brandList, beforeMonthlyData, thisMonthlyData];
  }

  async getYearlySales(partnerId: string): Promise<KoreaOrders[]> {
    const beforeYearlyData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoin(Products, 'product', 'order.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('order.payment_date BETWEEN :startDay AND :endDay', {
        startDay:
          DateTime.now().minus({ years: 1 }).toFormat('yyyy') + '-01-01',
        endDay: DateTime.now()
          .minus({ years: 1 })
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('partner.integration_id = :partnerId', { partnerId: partnerId })
      .getRawOne();
    const thisYearlyData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoin(Products, 'product', 'order.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('YEAR(order.payment_date) = :thisYear', {
        thisYear: DateTime.now().toFormat('yyyy'),
      })
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('partner.integration_id = :partnerId', { partnerId: partnerId })
      .getRawOne();
    return [beforeYearlyData, thisYearlyData];
  }

  async getChartSales(partnerId: string): Promise<KoreaOrders[][]> {
    const thisYearData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoin(Products, 'product', 'order.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select('DATE(order.payment_date)', 'payment_date')
      .addSelect(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('order.payment_date BETWEEN :startDate AND :tomorrow', {
        startDate: DateTime.now().minus({ days: 13 }).toFormat('yyyy-LL-dd'),
        tomorrow: DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd'),
      })
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('partner.integration_id = :partnerId', { partnerId: partnerId })
      .groupBy('DATE(order.payment_date)')
      .getRawMany();
    const beforeYearData = await this.koreaOrdersRepository
      .createQueryBuilder('order')
      .leftJoin(Products, 'product', 'order.product_id = product.id')
      .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
      .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
      .select('DATE(order.payment_date)', 'payment_date')
      .addSelect(
        'SUM((order.sale_price - order.discount_price) * order.quantity)',
        'sales_price',
      )
      .where('order.payment_date BETWEEN :startDate AND :tomorrow', {
        startDate: DateTime.now()
          .minus({ years: 1, days: 13 })
          .toFormat('yyyy-LL-dd'),
        tomorrow: DateTime.now()
          .minus({ years: 1 })
          .plus({ days: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .andWhere('order.status_id IN (:...ids)', {
        ids: ['p1', 'g1', 'd1', 'd2', 's1'],
      })
      .andWhere('partner.integration_id = :partnerId', { partnerId: partnerId })
      .groupBy('DATE(order.payment_date)')
      .getRawMany();
    return [thisYearData, beforeYearData];
  }

  async getProductSales(
    partnerId: string,
    dateText: string,
  ): Promise<KoreaOrders[]> {
    let startDay = '';
    if (dateText === 'today') {
      startDay = DateTime.now().toFormat('yyyy-LL-dd');
    } else if (dateText === 'yesterday') {
      startDay = DateTime.now().minus({ days: 1 }).toFormat('yyyy-LL-dd');
    } else if (dateText === 'last_7_days') {
      startDay = DateTime.now().minus({ days: 7 }).toFormat('yyyy-LL-dd');
    } else if (dateText === 'last_14_days') {
      startDay = DateTime.now().minus({ days: 14 }).toFormat('yyyy-LL-dd');
    }
    let productSalesData = [];
    if (partnerId == '1') {
      productSalesData = await this.koreaOrdersRepository
        .createQueryBuilder('orders')
        .leftJoin(Products, 'product', 'orders.product_id = product.id')
        .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
        .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
        .leftJoin(
          Costs,
          'cost',
          'orders.product_variant_id = cost.product_variant_id',
        )
        .select('product.name', 'product_name')
        .addSelect('product.image', 'image')
        .addSelect('brand.brand_name', 'brand_name')
        .addSelect('SUM(orders.quantity)', 'quantity')
        .addSelect(
          'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
          'sales_price',
        )
        .addSelect(
          'SUM(IF(cost.cost IS NULL, 0, cost.cost) * orders.quantity)',
          'cost',
        )
        .where('orders.payment_date BETWEEN :startDay AND :endDay', {
          startDay: startDay,
          endDay:
            dateText == 'today'
              ? DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')
              : DateTime.now().toFormat('yyyy-LL-dd'),
        })
        .andWhere('orders.status_id IN (:...ids)', {
          ids: ['p1', 'g1', 'd1', 'd2', 's1'],
        })
        .andWhere('partner.integration_id = :partnerId', {
          partnerId: partnerId,
        })
        .groupBy('orders.product_id')
        .orderBy('sales_price', 'DESC')
        .getRawMany();
    } else {
      productSalesData = await this.koreaOrdersRepository
        .createQueryBuilder('orders')
        .leftJoin(Products, 'product', 'orders.product_id = product.id')
        .leftJoin(Brands, 'brand', 'product.brand_id = brand.id')
        .leftJoin(Suppliers, 'partner', 'brand.supplier_id = partner.id')
        .select('product.name', 'product_name')
        .addSelect('product.image', 'image')
        .addSelect('brand.brand_name', 'brand_name')
        .addSelect('SUM(orders.quantity)', 'quantity')
        .addSelect(
          'SUM((orders.sale_price - orders.discount_price) * orders.quantity)',
          'sales_price',
        )
        .addSelect(
          'ROUND(SUM((orders.sale_price - orders.discount_price) * orders.quantity * orders.commission_rate / 100))',
          'commission',
        )
        .where('orders.payment_date BETWEEN :startDay AND :endDay', {
          startDay: startDay,
          endDay:
            dateText == 'today'
              ? DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')
              : DateTime.now().toFormat('yyyy-LL-dd'),
        })
        .andWhere('orders.status_id IN (:...ids)', {
          ids: ['p1', 'g1', 'd1', 'd2', 's1'],
        })
        .andWhere('partner.integration_id = :partnerId', {
          partnerId: partnerId,
        })
        .groupBy('orders.product_id')
        .orderBy('sales_price', 'DESC')
        .getRawMany();
    }
    if (!productSalesData) {
      throw new NotFoundException(`can't find product sales datas`);
    }
    return productSalesData;
  }
}

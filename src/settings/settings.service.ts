import { Injectable } from '@nestjs/common';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { Brands } from 'src/entities/brands.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import { Costs } from 'src/entities/costs.entity';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { Suppliers } from 'src/entities/suppliers.entity';
import { KoreaUsers } from 'src/entities/korea-users.entity';
import { Stocks } from 'src/entities/stocks.entity';
import * as qs from 'querystring';
import { Products } from 'src/entities/products.entity';
import { ProductVariants } from 'src/entities/product-variants.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SettingsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaLives)
    private koreaLivesRepository: Repository<KoreaLives>,
    @InjectRepository(Costs)
    private costsRepository: Repository<Costs>,
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(Suppliers)
    private suppliersRepository: Repository<Suppliers>,
    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,
    @InjectRepository(KoreaUsers)
    private koreaUsersRepository: Repository<KoreaUsers>,
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocationFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(ProductVariants)
    private productVariantsRepository: Repository<ProductVariants>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async updateMarketing(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'upload_kr!A2:J1000000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const marketingDataArray = dataArray.map((r) => ({
      id: r[0],
      channel: r[1],
      created_at: r[2],
      name: r[3],
      cost: Number(r[4]),
      click: Number(r[5]),
      exposure: Number(r[6]),
      conversion: Number(r[7]),
      brand_id: r[8],
      sno_no: r[9],
    }));
    return await this.koreaMarketingRepository
      .createQueryBuilder()
      .insert()
      .into(KoreaMarketing, [
        'id',
        'channel',
        'created_at',
        'name',
        'cost',
        'click',
        'exposure',
        'conversion',
        'brand_id',
        'sno_no',
      ])
      .values(marketingDataArray)
      .orUpdate(
        [
          'channel',
          'created_at',
          'name',
          'cost',
          'click',
          'exposure',
          'conversion',
          'brand_id',
          'sno_no',
        ],
        ['id'],
      )
      .execute();
  }

  async updateLive(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'live!A2:L10000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const liveDataArray = dataArray.map((r) => ({
      id: r[0],
      campaign_key: r[4],
      live_name: r[3],
      brand_id: r[5],
      live_page_sno: r[7],
      brand_page_sno: r[8],
      cost: Number(r[9]),
      start_date: DateTime.fromFormat(r[10], 'yyyy-LL-dd  hh:mm:ss').toISO(),
      end_date: DateTime.fromFormat(r[11], 'yyyy-LL-dd  hh:mm:ss').toISO(),
    }));
    return await this.koreaLivesRepository
      .createQueryBuilder()
      .insert()
      .into(KoreaLives, [
        'id',
        'campaign_key',
        'live_name',
        'brand_id',
        'live_page_sno',
        'brand_page_sno',
        'cost',
        'start_date',
        'end_date',
      ])
      .values(liveDataArray)
      .orUpdate(
        [
          'campaign_key',
          'live_name',
          'brand_id',
          'live_page_sno',
          'brand_page_sno',
          'cost',
          'start_date',
          'end_date',
        ],
        ['id'],
      )
      .execute();
  }

  async allocateMarketing() {
    const targetDate = [];
    const years = DateTime.now().minus({ days: 1 }).toFormat('yyyy');
    const days = DateTime.now().minus({ days: 1 }).toFormat('dd');
    const months = DateTime.now().minus({ days: 1 }).toFormat('LL');
    for (let i = 1; i <= Number(days); i++) {
      const day = i < 10 ? '0' + i : i;
      targetDate.push(years + '-' + months + '-' + day);
    }

    for (let i = 0; i < targetDate.length; i++) {
      const salesData = await this.dataSource.query(
        `SELECT b.brand_id
          , SUM((a.sale_price - a.discount_price) * a.quantity) as sales_price
          , SUM((a.sale_price - a.discount_price) * a.quantity) * 100 / SUM(SUM((a.sale_price - a.discount_price) * a.quantity)) OVER() as ratio
          , ROUND(im.indirect_marketing * SUM((a.sale_price - a.discount_price) * a.quantity) / SUM(SUM((a.sale_price - a.discount_price) * a.quantity)) OVER()) as allocated_fee
        FROM management.korea_orders a
          left join management.products b on a.product_id = b.id
          left join management.brands c on b.brand_id = c.id,
            (select SUM(a.cost) as indirect_marketing
            from management.korea_marketing a
              left join management.brands b on a.brand_id = b.id
            where a.created_at = ? AND b.supplier_id = '3') im
        where a.payment_date BETWEEN ? AND ?
          and a.status_id in ('p1', 'g1', 'd1', 'd2', 's1')
          and a.user_id != 'mmzjapan'
        group by b.brand_id`,
        [
          targetDate[i],
          targetDate[i],
          DateTime.fromISO(targetDate[i])
            .plus({ days: 1 })
            .toFormat('yyyy-LL-dd'),
        ],
      );

      const marketingFee = salesData.map((r) => ({
        created_at: DateTime.fromFormat(targetDate[i], 'yyyy-LL-dd').toISO(),
        account: 'marketing',
        brand_id: r.brand_id == null ? 'B0000000' : r.brand_id,
        allocated_fee: Number(r.allocated_fee),
      }));

      return await this.koreaAllocationFeesRepository
        .createQueryBuilder()
        .insert()
        .into(KoreaAllocationFees, [
          'created_at',
          'account',
          'brand_id',
          'allocated_fee',
        ])
        .values(marketingFee)
        .orUpdate(['allocated_fee'], ['created_at', 'account', 'brand_id'])
        .execute();
    }
  }

  async allocateLogistic() {
    const targetDate = [];
    const years = DateTime.now().minus({ days: 1 }).toFormat('yyyy');
    const days = DateTime.now().minus({ days: 1 }).toFormat('dd');
    const months = DateTime.now().minus({ days: 1 }).toFormat('LL');
    for (let i = 1; i <= Number(days); i++) {
      const day = i < 10 ? '0' + i : i;
      targetDate.push(years + '-' + months + '-' + day);
    }

    for (let i = 0; i < targetDate.length; i++) {
      const logisticData = await this.dataSource.query(
        `SELECT tt.brand_id
          , SUM(tt.polybag) + SUM(tt.logistic_fixed) AS logistic_fee
        FROM (
          SELECT a.id
            , b.brand_id
            , SUM(a.quantity) * 52 as polybag
            , co.logistic_fixed
          FROM management.korea_orders a
            LEFT JOIN management.products b on a.product_id = b.id
            LEFT JOIN management.brands c on b.brand_id = c.id
            LEFT JOIN management.suppliers d on c.supplier_id = d.id
            LEFT JOIN (
              SELECT a.id
                , ROUND((4000 + 3400) / COUNT(a.id)) as logistic_fixed 
              FROM ( 
                SELECT a.id, b.brand_id
                FROM management.korea_orders a
                  LEFT JOIN management.products b on a.product_id = b.id
                  LEFT JOIN management.brands c on b.brand_id = c.id
                  LEFT JOIN management.suppliers d on c.supplier_id = d.id
                WHERE a.payment_date BETWEEN ? AND ?
                  AND d.id = '1' 
                  AND a.status_id IN ('p1','g1','d1','d2','s1')
                GROUP BY a.id, b.brand_id
              ) a 
            GROUP BY a.id
            ) co ON a.id = co.id
        WHERE a.payment_date BETWEEN ? AND ?
          AND d.id = '1'
          AND a.status_id IN ('p1','g1','d1','d2','s1')
        GROUP BY a.id, b.brand_id
        ) tt
        GROUP by tt.brand_id`,
        [
          targetDate[i],
          DateTime.fromISO(targetDate[i])
            .plus({ days: 1 })
            .toFormat('yyyy-LL-dd'),
          targetDate[i],
          DateTime.fromISO(targetDate[i])
            .plus({ days: 1 })
            .toFormat('yyyy-LL-dd'),
        ],
      );

      const logisticFee = logisticData.map((r) => ({
        created_at: DateTime.fromFormat(targetDate[i], 'yyyy-LL-dd').toISO(),
        account: 'logistic',
        brand_id: r.brand_id == null ? 'B0000000' : r.brand_id,
        allocated_fee: Number(r.logistic_fee),
      }));

      return await this.koreaAllocationFeesRepository
        .createQueryBuilder()
        .insert()
        .into(KoreaAllocationFees, [
          'created_at',
          'account',
          'brand_id',
          'allocated_fee',
        ])
        .values(logisticFee)
        .orUpdate(['allocated_fee'], ['created_at', 'account', 'brand_id'])
        .execute();
    }
  }

  async getCost(client) {
    const costData = await this.dataSource.query(
      `SELECT a.product_id, a.product_variant_id, e.custom_variant_id, c.name
      FROM management.korea_orders a 
        LEFT JOIN management.costs b ON a.product_variant_id = b.product_variant_id
        LEFT JOIN management.products c ON a.product_id = c.id
        LEFT JOIN management.brands d ON c.brand_id = d.id
        LEFT JOIN management.product_variants e ON a.product_variant_id = e.id
      WHERE a.payment_date BETWEEN '2023-01-01' AND now()
        AND b.product_variant_id is null
        AND d.supplier_id = '1'
      GROUP BY a.product_variant_id`,
    );

    const gsapi = google.sheets({ version: 'v4', auth: client });
    const countOptions = {
      spreadsheetId: process.env.COST_SHEET_ID,
      range: 'db_upload!A2:A1000000',
    };
    const datas = await gsapi.spreadsheets.values.get(countOptions);
    const dataArray = datas.data.values;
    const rowcount = dataArray.length;

    const uploadData = costData.map((r) => [
      r.product_id,
      r.product_variant_id,
      r.custom_variant_id,
      r.name,
    ]);

    const options = {
      spreadsheetId: process.env.COST_SHEET_ID,
      range: `db_upload!A${String(Number(rowcount) + 2)}:D1000000`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        majorDimension: 'ROWS',
        values: uploadData,
      },
    };
    return await gsapi.spreadsheets.values.append(options);
  }

  async updateCost(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.COST_SHEET_ID,
      range: 'db_upload!A2:D200000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const costDataArray = dataArray.map((r) => ({
      product_id: r[0],
      product_variant_id: r[1],
      custom_variant_id: r[2],
      cost: Number(r[3]),
    }));
    return await this.costsRepository
      .createQueryBuilder()
      .insert()
      .into(Costs, [
        'product_id',
        'product_variant_id',
        'custom_variant_id',
        'cost',
      ])
      .values(costDataArray)
      .orUpdate(
        ['product_id', 'custom_variant_id', 'cost'],
        ['product_variant_id'],
      )
      .execute();
  }

  async exchageRateInfo(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.KOREA_SHEET_ID,
      range: 'rate!A2:C100000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const exchangeRateDataArray = dataArray.map((r) => ({
      created_at: r[0],
      usd: r[1],
      jpy: r[2],
    }));
    return await this.exchangeRateRepository
      .createQueryBuilder()
      .insert()
      .into(ExchangeRate, ['created_at', 'usd', 'jpy'])
      .values(exchangeRateDataArray)
      .orUpdate(['usd', 'jpy'], ['created_at'])
      .execute();
  }

  async supplierInfo(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.KOREA_SHEET_ID,
      range: 'supplier!A2:N100000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const supplierDataArray = dataArray.map((r) => ({
      id: r[0],
      integration_id: r[1],
      integration_name: r[2],
      supplier_name: r[3],
      ceo: r[4],
      registration_id: r[5],
      account_type: r[6],
      tax_type: r[7],
      account_count: r[8],
      bank_name: r[9],
      bank_account: r[10],
      account_owner: r[11],
      account_email: r[12],
      status_id: r[13],
    }));
    return await this.suppliersRepository
      .createQueryBuilder()
      .insert()
      .into(Suppliers, [
        'id',
        'integration_id',
        'integration_name',
        'supplier_name',
        'ceo',
        'registration_id',
        'account_type',
        'tax_type',
        'account_count',
        'bank_name',
        'bank_account',
        'account_owner',
        'account_email',
        'status_id',
      ])
      .values(supplierDataArray)
      .orUpdate(
        [
          'integration_id',
          'integration_name',
          'supplier_name',
          'ceo',
          'registration_id',
          'account_type',
          'tax_type',
          'account_count',
          'bank_name',
          'bank_account',
          'account_owner',
          'account_email',
          'status_id',
        ],
        ['id'],
      )
      .execute();
  }

  async brandInfo(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.KOREA_SHEET_ID,
      range: 'brand!A2:M100000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const brandDataArray = dataArray.map((r) => ({
      id: r[0],
      brand_name: r[1],
      account_type: r[2],
      design_type: r[3],
      sales_country: r[4],
      squad: r[5],
      manager_id: r[6],
      supplier_id: r[7],
      supplier_md_email: r[8],
      commission: r[9],
      created_at: r[10],
      deleted_at: r[11],
      status_id: r[12],
    }));
    return await this.brandsRepository
      .createQueryBuilder()
      .insert()
      .into(Brands, [
        'id',
        'brand_name',
        'account_type',
        'design_type',
        'sales_country',
        'squad',
        'manager_id',
        'supplier_id',
        'supplier_md_email',
        'commission',
        'created_at',
        'deleted_at',
        'status_id',
      ])
      .values(brandDataArray)
      .orUpdate(
        [
          'brand_name',
          'account_type',
          'design_type',
          'sales_country',
          'squad',
          'manager_id',
          'supplier_id',
          'supplier_md_email',
          'commission',
          'created_at',
          'deleted_at',
          'status_id',
        ],
        ['id'],
      )
      .execute();
  }

  async customerInfo(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.KOREA_SHEET_ID,
      range: 'customer!A2:G5000000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const customerDataArray = dataArray.map((r) => ({
      id: r[0],
      created_at: r[1],
      updated_at: r[2],
      user_birthday: r[3],
      first_child_birthday: r[4],
      second_child_birthday: r[5],
      cellphone: r[6],
    }));
    return await this.koreaUsersRepository
      .createQueryBuilder()
      .insert()
      .into(KoreaUsers, [
        'id',
        'created_at',
        'updated_at',
        'user_birthday',
        'first_child_birthday',
        'second_child_birthday',
        'cellphone',
      ])
      .values(customerDataArray)
      .orUpdate(
        [
          'created_at',
          'updated_at',
          'user_birthday',
          'first_child_birthday',
          'second_child_birthday',
          'cellphone',
        ],
        ['id'],
      )
      .execute();
  }

  async stockInfo(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.KOREA_SHEET_ID,
      range: 'stock!A2:L200000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const stockDataArray = dataArray.map((r) => ({
      seller_name: r[0],
      seller_id: r[1],
      custom_product_id: r[2],
      barcode: r[3],
      custom_variant_id: r[4],
      product_name: r[5],
      option_name: r[6],
      quantity: r[7],
      non_delivery_order: r[8],
      usable_quantity: r[9],
      cost: r[10],
      total_cost: r[11],
    }));
    return await this.stocksRepository
      .createQueryBuilder()
      .insert()
      .into(Stocks, [
        'seller_name',
        'seller_id',
        'custom_product_id',
        'barcode',
        'custom_variant_id',
        'product_name',
        'option_name',
        'quantity',
        'non_delivery_order',
        'usable_quantity',
        'cost',
        'total_cost',
      ])
      .values(stockDataArray)
      .orUpdate(
        [
          'seller_name',
          'seller_id',
          'custom_product_id',
          'custom_variant_id',
          'product_name',
          'option_name',
          'quantity',
          'non_delivery_order',
          'usable_quantity',
          'cost',
          'total_cost',
        ],
        ['barcode'],
      )
      .execute();
  }

  async koreaMonthInfo() {
    const targetDate = [];
    const years = DateTime.now().minus({ days: 1 }).toFormat('yyyy');
    const days = DateTime.now().minus({ days: 1 }).toFormat('dd');
    const months = DateTime.now().minus({ days: 1 }).toFormat('LL');
    for (let i = 1; i <= Number(days); i++) {
      const day = i < 10 ? '0' + i : i;
      targetDate.push(years + '-' + months + '-' + day);
    }

    for (let i = 0; i < targetDate.length; i++) {
      const salesData = await this.dataSource.query(
        `SELECT b.brand_id
          , SUM((a.sale_price - a.discount_price) * a.quantity) as sales_price
          , SUM((a.sale_price - a.discount_price) * a.quantity) * 100 / SUM(SUM((a.sale_price - a.discount_price) * a.quantity)) OVER() as ratio
          , ROUND(im.indirect_marketing * SUM((a.sale_price - a.discount_price) * a.quantity) / SUM(SUM((a.sale_price - a.discount_price) * a.quantity)) OVER()) as allocated_fee
        FROM management.korea_orders a
          left join management.products b on a.product_id = b.id
          left join management.brands c on b.brand_id = c.id,
            (select SUM(a.cost) as indirect_marketing
            from management.korea_marketing a
              left join management.brands b on a.brand_id = b.id
            where a.created_at = ? AND b.supplier_id = '3') im
        where a.payment_date BETWEEN ? AND ?
          and a.status_id in ('p1', 'g1', 'd1', 'd2', 's1')
          and a.user_id != 'mmzjapan'
        group by b.brand_id`,
        [
          targetDate[i],
          targetDate[i],
          DateTime.fromISO(targetDate[i])
            .plus({ days: 1 })
            .toFormat('yyyy-LL-dd'),
        ],
      );

      const marketingFee = salesData.map((r) => ({
        created_at: DateTime.fromFormat(targetDate[i], 'yyyy-LL-dd').toISO(),
        account: 'marketing',
        brand_id: r.brand_id == null ? 'B0000000' : r.brand_id,
        allocated_fee: Number(r.allocated_fee),
      }));

      return await this.koreaAllocationFeesRepository
        .createQueryBuilder()
        .insert()
        .into(KoreaAllocationFees, [
          'created_at',
          'account',
          'brand_id',
          'allocated_fee',
        ])
        .values(marketingFee)
        .orUpdate(['allocated_fee'], ['created_at', 'account', 'brand_id'])
        .execute();
    }
  }

  async koreaDayInfo() {
    const targetDate = [];
    const years = DateTime.now().minus({ days: 1 }).toFormat('yyyy');
    const days = DateTime.now().minus({ days: 1 }).toFormat('dd');
    const months = DateTime.now().minus({ days: 1 }).toFormat('LL');
    for (let i = 1; i <= Number(days); i++) {
      const day = i < 10 ? '0' + i : i;
      targetDate.push(years + '-' + months + '-' + day);
    }

    for (let i = 0; i < targetDate.length; i++) {
      const salesData = await this.dataSource.query(
        `SELECT b.brand_id
          , SUM((a.sale_price - a.discount_price) * a.quantity) as sales_price
          , SUM((a.sale_price - a.discount_price) * a.quantity) * 100 / SUM(SUM((a.sale_price - a.discount_price) * a.quantity)) OVER() as ratio
          , ROUND(im.indirect_marketing * SUM((a.sale_price - a.discount_price) * a.quantity) / SUM(SUM((a.sale_price - a.discount_price) * a.quantity)) OVER()) as allocated_fee
        FROM management.korea_orders a
          left join management.products b on a.product_id = b.id
          left join management.brands c on b.brand_id = c.id,
            (select SUM(a.cost) as indirect_marketing
            from management.korea_marketing a
              left join management.brands b on a.brand_id = b.id
            where a.created_at = ? AND b.supplier_id = '3') im
        where a.payment_date BETWEEN ? AND ?
          and a.status_id in ('p1', 'g1', 'd1', 'd2', 's1')
          and a.user_id != 'mmzjapan'
        group by b.brand_id`,
        [
          targetDate[i],
          targetDate[i],
          DateTime.fromISO(targetDate[i])
            .plus({ days: 1 })
            .toFormat('yyyy-LL-dd'),
        ],
      );

      const marketingFee = salesData.map((r) => ({
        created_at: DateTime.fromFormat(targetDate[i], 'yyyy-LL-dd').toISO(),
        account: 'marketing',
        brand_id: r.brand_id == null ? 'B0000000' : r.brand_id,
        allocated_fee: Number(r.allocated_fee),
      }));

      return await this.koreaAllocationFeesRepository
        .createQueryBuilder()
        .insert()
        .into(KoreaAllocationFees, [
          'created_at',
          'account',
          'brand_id',
          'allocated_fee',
        ])
        .values(marketingFee)
        .orUpdate(['allocated_fee'], ['created_at', 'account', 'brand_id'])
        .execute();
    }
  }

  async addProductInfo() {
    const productData = await this.dataSource.query(
      `SELECT a.product_id
      FROM management.korea_orders a 
        LEFT JOIN management.products b ON a.product_id = b.id
      WHERE b.id is NULL 
        AND a.payment_date BETWEEN '2023-01-01' AND now()
      GROUP BY a.product_id`,
    );

    const products = productData.map((r) => r.product_id);
    for (const goodsNo of products) {
      this.getProduct(goodsNo);
    }
  }

  async marketingPart(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.KOREA_SHEET_ID,
      range: 'stock!A2:L200000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    const stockDataArray = dataArray.map((r) => ({
      seller_name: r[0],
      seller_id: r[1],
      custom_product_id: r[2],
      barcode: r[3],
      custom_variant_id: r[4],
      product_name: r[5],
      option_name: r[6],
      quantity: r[7],
      non_delivery_order: r[8],
      usable_quantity: r[9],
      cost: r[10],
      total_cost: r[11],
    }));
    return await this.stocksRepository
      .createQueryBuilder()
      .insert()
      .into(Stocks, [
        'seller_name',
        'seller_id',
        'custom_product_id',
        'barcode',
        'custom_variant_id',
        'product_name',
        'option_name',
        'quantity',
        'non_delivery_order',
        'usable_quantity',
        'cost',
        'total_cost',
      ])
      .values(stockDataArray)
      .orUpdate(
        [
          'seller_name',
          'seller_id',
          'custom_product_id',
          'custom_variant_id',
          'product_name',
          'option_name',
          'quantity',
          'non_delivery_order',
          'usable_quantity',
          'cost',
          'total_cost',
        ],
        ['barcode'],
      )
      .execute();
  }

  async getProduct(goodsNo) {
    const originData = {
      KR: '한국',
      JP: '일본',
      US: '미국',
      VE: '베트남',
      CN: '중국',
      ID: '인도네시아',
      IN: '인도',
      MY: '말레이시아',
    };

    const paramDetail =
      `partner_key=${process.env.PARTNER_KEY}&key=${process.env.KEY}&` +
      qs.stringify({
        goodsNo: goodsNo,
        page: 1,
        size: 10,
      });

    const options = {
      method: 'POST',
      url: `https://openhub.godo.co.kr/godomall5/goods/Goods_Search.php?${paramDetail}`,
    };

    const xmlRowData = this.httpService.get(
      `https://openhub.godo.co.kr/godomall5/goods/Goods_Search.php?${paramDetail}`,
    );
    const jsonData = await parseXml(xmlRowData);
    const goodsData = jsonData.data.return[0].goods_data;
    if (goodsData == undefined || goodsData == null) {
      return 'No data';
    }

    for (let i = 0; i < goodsData.length; i++) {
      const r = goodsData[i];
      const productData = [
        r.goodsNo[0],
        r.goodsNm[0],
        r.listImageData == undefined ? null : r.listImageData[0]._,
        r.brandCd[0],
        r.goodsCd[0],
        r.modDt[0] == '' ? null : r.modDt[0],
        r.trendNo[0] == '' ? null : r.trendNo[0],
        r.originNm[0] == ''
          ? null
          : Object.keys(originData)[
              Object.values(originData).indexOf(r.originNm[0])
            ],
        r.taxFreeFl[0],
        Number(r.fixedPrice[0]) > 100000000 ? 0 : Number(r.fixedPrice[0]),
        Number(r.goodsPrice[0]) > 100000000 ? 0 : Number(r.goodsPrice[0]),
        r.cafe24ProductCode[0] == '' ? null : r.cafe24ProductCode[0],
      ];

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products, [
          'id',
          'name',
          'image',
          'brand_id',
          'custom_product_id',
          'updated_at',
          'seller_id',
          'production_country',
          'tax_type',
          'fixed_price',
          'product_price',
          'cafe_product_code',
        ])
        .values(productData)
        .orUpdate(
          [
            'name',
            'image',
            'brand_id',
            'custom_product_id',
            'updated_at',
            'seller_id',
            'production_country',
            'tax_type',
            'fixed_price',
            'product_price',
            'cafe_product_code',
          ],
          ['id'],
        )
        .execute();

      if (r.optionData) {
        for (let j = 0; j < r.optionData.length; j++) {
          const s = r.optionData[j];

          const optionData = [
            s.sno[0],
            s.optionCode[0],
            s.optionValue1[0],
            s.optionValue2[0],
            s.optionValue3[0],
            s.optionValue4[0],
            r.goodsNo[0],
            Number(s.optionPrice[0]),
            s.modDt[0] == '' ? null : s.modDt[0],
            s.cafe24OptionCode[0] == '' ? null : s.cafe24OptionCode[0],
          ];

          await this.productVariantsRepository
            .createQueryBuilder()
            .insert()
            .into(ProductVariants, [
              'id',
              'custom_variant_id',
              'variant_color',
              'variant_size',
              'variant_etc1',
              'variant_etc2',
              'product_id',
              'option_price',
              'updated_at',
              'cafe_variant_code',
            ])
            .values(optionData)
            .orUpdate(
              [
                'custom_variant_id',
                'variant_color',
                'variant_size',
                'variant_etc1',
                'variant_etc2',
                'product_id',
                'option_price',
                'updated_at',
                'cafe_variant_code',
              ],
              ['id'],
            )
            .execute();
        }
      }
    }
  }

  async parseXml() {}
}

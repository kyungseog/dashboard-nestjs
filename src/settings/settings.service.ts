import { Injectable } from '@nestjs/common';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { KoreaOrders } from 'src/entities/korea-orders.entity';
import { Products } from 'src/entities/products.entity';
import { Brands } from 'src/entities/brands.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import { JapanLives } from 'src/entities/japan-lives.entity';
import { JapanMarketing } from 'src/entities/japan-marketing.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaLives)
    private koreaLivesRepository: Repository<KoreaLives>,
    @InjectRepository(KoreaOrders)
    private koreaOrdersRepository: Repository<KoreaOrders>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocationFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(JapanLives)
    private japanLivesRepository: Repository<JapanLives>,
    @InjectRepository(JapanMarketing)
    private japanMarketingRepository: Repository<JapanMarketing>,
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
        'created_date',
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
          'created_date',
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
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'db_upload!A2:J1000000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
  }
}

import { Injectable } from '@nestjs/common';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { KoreaLives } from 'src/entities/korea-lives.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import * as keys from './google/data.json';
import { JapanLives } from 'src/entities/japan-lives.entity';
import { JapanMarketing } from 'src/entities/japan-marketing.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(KoreaLives)
    private koreaLivesRepository: Repository<KoreaLives>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocationFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(JapanLives)
    private japanLivesRepository: Repository<JapanLives>,
    @InjectRepository(JapanMarketing)
    private japanMarketingRepository: Repository<JapanMarketing>,
  ) {}

  async setMarketing() {
    const client = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    (client) => {
      return new Promise((resolve, reject) => {
        client.authorize((err, tokens) => {
          return err ? reject(err) : resolve(tokens);
        });
      });
    };
    const marketing = await this.updateMarketing(client);
    const live = await this.updateLive(client);
    return { marketing, live };
  }

  async setAllocateExpense() {
    const client = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    (client) => {
      return new Promise((resolve, reject) => {
        client.authorize((err, tokens) => {
          return err ? reject(err) : resolve(tokens);
        });
      });
    };
    const marketing = await this.allocateMarketing(client);
    const logistic = await this.allocateLogistic(client);
    return { marketing, logistic };
  }

  async updateMarketing(client) {
    return 'ok';
    // const gsapi = google.sheets({ version: 'v4', auth: client });
    // const options = {
    //   spreadsheetId: process.env.MARKETING_SHEET_ID,
    //   range: 'upload_kr!A2:J1000000',
    // };

    // const datas = await gsapi.spreadsheets.values.get(options);
    // const dataArray: JapanMarketing | null | undefined = datas.data.values;
    // return await this.japanMarketingRepository.save(dataArray);
    // .createQueryBuilder()
    // .insert()
    // .into(JapanMarketing, [
    //   'id',
    //   'channel',
    //   'created_date',
    //   'name',
    //   'cost',
    //   'click',
    //   'exposure',
    //   'conversion',
    //   'brand_id',
    //   'sno_no',
    // ])
    // .values(dataArray)
    // .orUpdate(
    //   [
    //     'channel',
    //     'created_date',
    //     'name',
    //     'cost',
    //     'click',
    //     'exposure',
    //     'conversion',
    //     'brand_id',
    //     'sno_no',
    //   ],
    //   ['id'],
    // )
    // .execute();
  }

  async updateLive(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'live!A2:L10000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;

    const filteredDataArray = dataArray.map((r) => ({
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
    return await this.japanLivesRepository.save(filteredDataArray);
  }

  async allocateMarketing(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'upload_kr!A2:J1000000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray: any[] = datas.data.values;
    const message = await this.japanMarketingRepository.upsert(dataArray, [
      'id',
    ]);
    return message.raw;
  }

  async allocateLogistic(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'upload_kr!A2:J1000000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray: any[] = datas.data.values;
    const message = await this.japanMarketingRepository.upsert(dataArray, [
      'id',
    ]);
    return message.raw;
  }
}

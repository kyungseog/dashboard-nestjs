import { Injectable } from '@nestjs/common';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { JapanLives } from 'src/entities/japan-lives.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import * as keys from './google/data.json';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(LiveCommerces)
    private liveCommercesRepository: Repository<LiveCommerces>,
    @InjectRepository(KoreaAllocationFees)
    private koreaAllocationFeesRepository: Repository<KoreaAllocationFees>,
    @InjectRepository(JapanLives)
    private japanLivesRepository: Repository<JapanLives>,
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

    const updateMarketing = await this.updateMarketingData(client);
    const updateLive = await this.updateLiveData(client);
    return { updateMarketing, updateLive };
  }

  async updateMarketingData(client) {
    return 'marketing ok';
    // const gsapi = google.sheets({ version: 'v4', auth: client });
    // const options = {
    //   spreadsheetId: process.env.MARKETING_SHEET_ID,
    //   range: 'upload_kr!A2:J1000000',
    // };

    // const datas = await gsapi.spreadsheets.values.get(options);
    // const dataArray = datas.data.values;

    // return this.koreaMarketingRepository
    //   .createQueryBuilder()
    //   .insert()
    //   .into(KoreaMarketing)
    //   .values([dataArray])
    //   .orUpdate(
    //     ['channel'],
    //     ['created_at'],
    //     ['name'],
    //     ['cost'],
    //     ['click'],
    //     ['exposure'],
    //     ['conversion'],
    //     ['brand_id'],
    //     ['sno_no'],
    //   )
    //   .execute();
  }

  async updateLiveData(client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const options = {
      spreadsheetId: process.env.MARKETING_SHEET_ID,
      range: 'live!A2:L100000',
    };

    const datas = await gsapi.spreadsheets.values.get(options);
    const dataArray = datas.data.values;
    interface filteredDataObject {
      id: string;
      campaign_key: string;
      live_name: string;
      brand_id: string;
      live_page_sno: string;
      brand_page_sno: string;
      cost: number;
      start_date: string;
      end_date: string;
    }

    const filteredDataArray: any[] = dataArray.map(
      (r): filteredDataObject => ({
        id: r[0],
        campaign_key: r[4],
        live_name: r[3],
        brand_id: r[5],
        live_page_sno: r[7],
        brand_page_sno: r[8],
        cost: Number(r[9]),
        start_date: DateTime.fromFormat(r[10], 'yyyy-LL-dd  hh:mm:ss').toISO(),
        end_date: DateTime.fromFormat(r[11], 'yyyy-LL-dd  hh:mm:ss').toISO(),
      }),
    );

    const message = await this.japanLivesRepository.upsert(filteredDataArray, [
      'id',
    ]);
    console.log(message);
    return message.raw;
  }
}

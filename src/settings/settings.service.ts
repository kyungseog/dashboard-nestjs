import { Injectable } from '@nestjs/common';
import { KoreaMarketing } from 'src/entities/korea-marketing.entity';
import { KoreaAllocationFees } from 'src/entities/korea-allocation-fees.entity';
import { LiveCommerces } from 'src/entities/live-commerces.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import keys from './google/data.json';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(KoreaMarketing)
    private koreaMarketingRepository: Repository<KoreaMarketing>,
    @InjectRepository(LiveCommerces)
    private liveCommercesRepository: Repository<LiveCommerces>,
  ) {}

  setMarketing() {
    const client = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    client.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log('GoogleSheet Connected!');
        updateMarketingData(client);
        updateLiveData(client);
      }
    });

    async function updateMarketingData(client) {
      const gsapi = google.sheets({ version: 'v4', auth: client });
      const options = {
        spreadsheetId: process.env.MARKETING_SHEET_ID,
        range: 'upload_kr!A2:J1000000',
      };

      const datas = await gsapi.spreadsheets.values.get(options);
      const dataArray = datas.data.values;

      this.koreaMarketingRepository
        .createQueryBuilder()
        .insert()
        .into(KoreaMarketing)
        .values([dataArray])
        .orUpdate(
          ['channel'],
          ['created_at'],
          ['name'],
          ['cost'],
          ['click'],
          ['exposure'],
          ['conversion'],
          ['brand_id'],
          ['sno_no'],
        )
        .execute();
    }

    async function updateLiveData(client) {
      const gsapi = google.sheets({ version: 'v4', auth: client });
      const options = {
        spreadsheetId: process.env.MARKETING_SHEET_ID,
        range: 'live!A2:L100000',
      };

      const datas = await gsapi.spreadsheets.values.get(options);
      const dataArray = datas.data.values;

      const filteredDataArray = dataArray.map((r) => [
        r[0],
        r[4],
        r[3],
        r[5],
        r[7],
        r[8],
        r[9],
        r[10],
        r[11],
      ]);

      this.liveCommercesRepository
        .createQueryBuilder()
        .insert()
        .into(KoreaMarketing)
        .values([filteredDataArray])
        .orUpdate(
          ['channel'],
          ['created_at'],
          ['name'],
          ['cost'],
          ['click'],
          ['exposure'],
          ['conversion'],
          ['brand_id'],
          ['sno_no'],
        )
        .execute();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { google } from 'googleapis';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getRealtimeReport() {
    const analyticsDataClient = new BetaAnalyticsDataClient();
    const response = analyticsDataClient.runRealtimeReport({
      property: `properties/${250906029}`,
      minuteRanges: [
        {
          name: '0-4 minutes ago',
          startMinutesAgo: 4,
        },
      ],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
    });
    return response[0].rows;
  }
}

import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { google } from 'googleapis';
import * as keys from './google/data.json';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/marketing')
  async setMarketing(): Promise<object> {
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
    const marketing = await this.settingsService.updateMarketing(client);
    const live = await this.settingsService.updateLive(client);
    return { marketing, live };
  }

  @Get('/allocateExpense')
  async setAllocateExpense(): Promise<object> {
    const marketing = await this.settingsService.allocateMarketing();
    const logistic = await this.settingsService.allocateLogistic();
    return { marketing, logistic };
  }

  @Get('/cost')
  async setCost(): Promise<object> {
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
    return await this.settingsService.getCost(client);
  }

  @Get('/updateCost')
  async setUpdateCost(): Promise<object> {
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
    return await this.settingsService.updateCost(client);
  }

  @Get('/koreaInfomation')
  async setKoreaInfomation(): Promise<object> {
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
    const exchageRate = await this.settingsService.exchageRateInfo(client);
    const supplier = await this.settingsService.supplierInfo(client);
    const brand = await this.settingsService.brandInfo(client);
    const customer = await this.settingsService.customerInfo(client);
    const stock = await this.settingsService.stockInfo(client);
    return { exchageRate, supplier, brand, customer, stock };
  }

  @Get('/koreaMonthInfomation')
  async setKoreaMonthInfomation(): Promise<object> {
    return await this.settingsService.koreaMonthInfo();
  }

  @Get('/koreaDayInfomation')
  async setKoreaDayInfomation(): Promise<object> {
    return await this.settingsService.koreaDayInfo();
  }
}

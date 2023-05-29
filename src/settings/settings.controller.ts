import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/marketing')
  async setMarketing(): Promise<object> {
    return await this.settingsService.setMarketing();
  }

  @Get('/allocateExpense')
  async setAllocateExpense(): Promise<object> {
    return await this.settingsService.setAllocateExpense();
  }
}

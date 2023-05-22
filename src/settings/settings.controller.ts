import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/marketing')
  async setMarketing(): Promise<object> {
    return await this.settingsService.setMarketing();
  }
}

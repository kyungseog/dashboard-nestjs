import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/marketing')
  setMarketing() {
    return this.settingsService.setMarketing();
  }
}

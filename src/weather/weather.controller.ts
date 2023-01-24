import { Controller, Get, Query } from '@nestjs/common';
import { CountryType } from 'src/entities/enums';
import { Weather } from 'src/entities/weather.entity';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  getWeather(
    @Query() weatherQuery: { country: CountryType; today: string },
  ): Promise<Weather[]> {
    return this.weatherService.getWeather(weatherQuery);
  }
}

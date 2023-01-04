import { Controller, Get, Query } from '@nestjs/common';
import { Weather } from 'src/entities/weather.entity';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  getWeather(@Query() weatherQuery): Promise<Weather[]> {
    return this.weatherService.getWeather(weatherQuery);
  }
}

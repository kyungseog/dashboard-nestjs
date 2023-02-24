import { Controller, Get, Param, Query } from '@nestjs/common';
import { Weather } from 'src/entities/weather.entity';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('/:city')
  getWeather(@Param('city') city: string): Promise<Weather[][]> {
    return this.weatherService.getWeather(city);
  }
}

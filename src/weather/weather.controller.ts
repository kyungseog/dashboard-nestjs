import { Controller, Get, Param } from '@nestjs/common';
import { CountryType } from 'src/entities/enums';
import { Weather } from 'src/entities/weather.entity';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private managersService: WeatherService) {}

  @Get('/:country')
  getWeatherByCountry(
    @Param('country') country: CountryType,
  ): Promise<Weather> {
    return this.managersService.getWeatherByCountry(country);
  }
}

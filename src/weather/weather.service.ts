import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryType } from 'src/entities/enums';
import { Weather } from 'src/entities/weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async getWeatherByCountry(country: CountryType): Promise<Weather> {
    const found = await this.weatherRepository.findOneBy({ country: country });
    if (!found) {
      throw new NotFoundException(
        `can't find Weather Data with country ${country}`,
      );
    }
    return found;
  }
}

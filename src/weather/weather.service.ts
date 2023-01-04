import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from 'src/entities/weather.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async getWeather(weatherQuery): Promise<Weather[]> {
    const { country, start_date, end_date } = weatherQuery;
    const found = await this.weatherRepository.findBy({
      country: country,
      date: Between(start_date, end_date),
    });
    if (!found) {
      throw new NotFoundException(`can't find Weather Data`);
    }
    return found;
  }
}

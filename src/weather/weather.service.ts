import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from 'src/entities/weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  getWeather(city: string, startDay: string, endDay: string) {
    return this.weatherRepository
      .createQueryBuilder()
      .where('city = :city', { city })
      .andWhere('date BETWEEN :startDay AND :endDay ', {
        startDay,
        endDay,
      })
      .getRawMany();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from 'src/entities/weather.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async getWeather(city: string): Promise<Weather[][]> {
    const thisYear = await this.weatherRepository
      .createQueryBuilder()
      .where('city = :city', { city })
      .andWhere('date >= :today', {
        today: DateTime.now().toFormat('yyyy-LL-dd'),
      })
      .andWhere('date < :targetDay', {
        targetDay: DateTime.now().plus({ days: 7 }).toFormat('yyyy-LL-dd'),
      })
      .getRawMany();
    const beforeYear = await this.weatherRepository
      .createQueryBuilder()
      .where('city = :city', { city })
      .andWhere('date >= :today', {
        today: DateTime.now().minus({ years: 1 }).toFormat('yyyy-LL-dd'),
      })
      .andWhere('date < :targetDay', {
        targetDay: DateTime.now()
          .plus({ days: 7 })
          .minus({ years: 1 })
          .toFormat('yyyy-LL-dd'),
      })
      .getRawMany();
    return [thisYear, beforeYear];
  }
}

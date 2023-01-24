import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from 'src/entities/weather.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { CountryType } from 'src/entities/enums';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async getWeather(weatherQuery: {
    country: CountryType;
    today: string;
  }): Promise<Weather[]> {
    const { country, today } = weatherQuery;
    const targetDay: string = DateTime.fromISO(today)
      .plus({ days: 6 })
      .toFormat('yyyy-LL-dd');
    const found = await this.weatherRepository
      .createQueryBuilder('weather')
      .where('weather.country = :country', { country: country })
      .andWhere('weather.date >= today', { today: today })
      .andWhere('weather.date =< targetDay', { targetDay: targetDay })
      .getRawMany();
    if (!found) {
      throw new NotFoundException(`can't find Weather Data`);
    }
    return found;
  }
}

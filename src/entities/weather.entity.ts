import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CountryType } from './enums';

@Entity()
export class Weather extends BaseEntity {
  @PrimaryColumn({ type: 'enum', enum: CountryType })
  country: CountryType;

  @PrimaryColumn('char', { length: 10 })
  city: string;

  @PrimaryColumn('datetime')
  created_at: Date;

  @Column('float')
  temperature_min: number;

  @Column('float')
  temperature_max: number;

  @Column('int')
  estimate_am: number;

  @Column('int')
  estimate_pm: number;

  @Column('float')
  rain: number;

  @Column('float')
  snow: number;

  @Column('char', { length: 10 })
  status: string;
}

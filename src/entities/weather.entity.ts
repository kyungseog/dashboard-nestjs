import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CountryType } from './enums';

@Entity()
export class Weather extends BaseEntity {
  @PrimaryColumn({ type: 'enum', enum: CountryType })
  country: CountryType;

  @PrimaryColumn('char', { length: 10 })
  city: string;

  @PrimaryColumn('date')
  date: Date;

  @Column('float', { nullable: true })
  temperature_min: number;

  @Column('float', { nullable: true })
  temperature_max: number;

  @Column('int', { nullable: true })
  estimate_am: number;

  @Column('int', { nullable: true })
  estimate_pm: number;

  @Column('float', { nullable: true })
  rain: number;

  @Column('float', { nullable: true })
  snow: number;

  @Column('char', { nullable: true, length: 10 })
  status_name: string;
}

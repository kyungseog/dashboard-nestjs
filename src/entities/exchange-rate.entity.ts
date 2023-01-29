import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ExchangeRate extends BaseEntity {
  @PrimaryColumn('date')
  created_at: Date;

  @Column('float')
  usd: number;

  @Column('float')
  jpy: number;
}

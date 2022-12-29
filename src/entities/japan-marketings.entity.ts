import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { MarketingChannel } from './enums';

@Entity()
export class JapanMarketings extends BaseEntity {
  @PrimaryColumn('char')
  brand_id: string;

  @PrimaryColumn({ type: 'enum', enum: MarketingChannel })
  channel: MarketingChannel;

  @Column('int')
  cost: number;

  @PrimaryColumn('date')
  issued_at: Date;
}

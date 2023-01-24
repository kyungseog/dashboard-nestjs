import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaMarketingNaver extends BaseEntity {
  @PrimaryColumn('char', { length: 50 })
  id: string;

  @Column('varchar')
  name: string;

  @Column('int')
  cost: number;

  @Column('float')
  cpc: number;

  @Column('float')
  ctr: number;

  @Column('int')
  exposure: number;

  @Column('int')
  reach: number;

  @Column('int', { nullable: true })
  click: number;

  @Column('int', { nullable: true })
  conversion: number;

  @Column('float', { nullable: true })
  roas: number;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;
}

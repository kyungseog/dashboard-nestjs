import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class LiveCommerces extends BaseEntity {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar')
  campaign_key: string;

  @Column('varchar')
  name: string;

  @Column('char', { length: 10, nullable: true })
  brand_id: string;

  @Column('char', { length: 10, nullable: true })
  event_sno: string;

  @Column('int')
  cost: number;

  @Column('datetime')
  start_date: Date;

  @Column('datetime', { nullable: true })
  end_date: Date;
}

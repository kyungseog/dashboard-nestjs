import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaMarketingKakaom extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('char', { length: 50 })
  channel: string;

  @Column('date')
  created_at: Date;

  @Column('int')
  sending: number;

  @Column('int')
  cost: number;

  @Column('int')
  exposure: number;

  @Column('int')
  click: number;

  @Column('int')
  section: number;

  @Column('text')
  name: string;

  @Column('char', { length: 50 })
  brand_id: string;

  @Column('int')
  section_click: number;
}

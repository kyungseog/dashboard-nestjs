import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaMarketing extends BaseEntity {
  @PrimaryColumn('char', { length: 50 })
  id: string;

  @Column('char', { length: 50 })
  channel: string;

  @Column('date')
  created_date: Date;

  @Column('varchar')
  name: string;

  @Column('int')
  cost: number;

  @Column('int')
  click: number;

  @Column('int')
  exposure: number;

  @Column('int', { nullable: true })
  conversion: number;

  @Column('char', { length: 50 })
  brand_id: string;
}

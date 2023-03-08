import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaIfdo extends BaseEntity {
  @PrimaryColumn('char', { length: 100 })
  id: string;

  @Column('date')
  issued_at: Date;

  @Column('varchar')
  name: string;

  @Column('varchar')
  url: string;

  @Column('int')
  impression: number;

  @Column('int')
  inflow: number;

  @Column('int')
  buying_count: number;

  @Column('int')
  buying_amount: number;

  @Column('int')
  buying_rate: number;

  @Column('char', { length: 50 })
  is_sno: number;

  @Column('char', { length: 50 })
  sno_no: number;
}

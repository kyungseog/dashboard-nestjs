import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LiveCommerces extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  campaign_key: string;

  @Column('varchar')
  name: string;

  @Column('char', { length: 10 })
  supplier_id: string;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column('datetime')
  start_date: Date;
}

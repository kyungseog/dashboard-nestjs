import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LiveCommerces extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('varchar')
  campaign_key: string;

  @Column('int')
  supplier_id: number;

  @Column('char')
  brand_code: string;

  @Column('datetime')
  start_date: Date;
}

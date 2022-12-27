import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class LiveCommerce extends BaseEntity {
  @PrimaryColumn()
  campaign_key: string;

  @Column()
  supplier_no: string;

  @Column()
  brand_code: string;

  @Column()
  start_date: Date;
}

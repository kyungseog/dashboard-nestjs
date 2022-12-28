import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class LiveCommerces extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('int')
  supplier_id: number;

  @Column('char')
  brand_code: string;

  @Column('datetime')
  start_date: Date;
}

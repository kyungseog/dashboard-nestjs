import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { TaxType } from './enums';

@Entity()
export class Products extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { length: 10 })
  product_code: string;

  @Column('varchar')
  name: string;

  @Column('int')
  fixed_price: number;

  @Column('varchar')
  image: string;

  @Column({ type: 'enum', enum: TaxType })
  tax_type: TaxType;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column('char', { length: 10 })
  custom_product_id: string;

  @Column('datetime')
  updated_at: Date;
}

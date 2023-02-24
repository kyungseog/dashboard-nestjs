import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CountryType, TaxType } from './enums';

@Entity()
export class Products extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  image: string;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column('varchar', { nullable: true })
  custom_product_id: string;

  @Column('datetime', { nullable: true })
  updated_at: Date;

  @Column('char', { nullable: true, length: 10 })
  seller_id: string;

  @Column({ type: 'enum', enum: CountryType, nullable: true })
  production_country: CountryType;

  @Column({ type: 'enum', enum: TaxType })
  tax_type: TaxType;

  @Column('int')
  fixed_price: number;

  @Column('int')
  product_price: number;

  @Column('varchar', { nullable: true })
  cafe_product_code: string;
}

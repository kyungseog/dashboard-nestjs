import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { AgeType, CountryType } from './enums';

@Entity()
export class ProductVariants extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { length: 10 })
  variant_code: string;

  @Column('char', { length: 10 })
  custom_variant_id: string;

  @Column('char', { length: 10 })
  cost_id: string;

  @Column('char', { length: 10 })
  product_id: string;

  @Column('varchar')
  variant_name: string;

  @Column('char', { length: 10 })
  seller_id: string;

  @Column({ type: 'enum', enum: CountryType })
  production_country: CountryType;

  @Column({ type: 'enum', enum: AgeType })
  age_type: AgeType;
}

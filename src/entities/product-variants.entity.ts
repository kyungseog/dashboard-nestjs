import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { AgeType } from './enums';

@Entity()
export class ProductVariants extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { nullable: true, length: 10 })
  custom_variant_id: string;

  @Column('char', { nullable: true, length: 10 })
  cost_id: string;

  @Column('varchar')
  variant_name: string;

  @Column({ type: 'enum', enum: AgeType })
  age_type: AgeType;

  @Column('char', { length: 10 })
  product_id: string;
}

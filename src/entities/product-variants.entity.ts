import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { AgeType } from './enums';

@Entity()
export class ProductVariants extends BaseEntity {
  @PrimaryColumn('char', { length: 20 })
  id: string;

  @Column('varchar', { nullable: true })
  custom_variant_id: string;

  @Column('char', { nullable: true, length: 10 })
  cost_id: string;

  @Column('varchar', { nullable: true })
  variant_color: string;

  @Column('varchar', { nullable: true })
  variant_size: string;

  @Column('varchar', { nullable: true })
  variant_etc1: string;

  @Column('varchar', { nullable: true })
  variant_etc2: string;

  @Column({ type: 'enum', enum: AgeType, nullable: true })
  age_type: AgeType;

  @Column('char', { length: 10 })
  product_id: string;
}

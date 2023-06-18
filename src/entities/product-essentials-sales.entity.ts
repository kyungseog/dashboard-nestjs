import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductEssentialsSales extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  product_id: string;

  @PrimaryColumn('varchar', { length: 100 })
  product_variant_id: string;

  @Column('varchar', { length: 100, nullable: true })
  custom_variant_id: string;

  @Column('int', { nullable: true })
  variant_cost: number;

  @Column('varchar', { nullable: true })
  product_sales_name: string;

  @PrimaryColumn('varchar', { length: 100 })
  barcode: string;

  @Column('varchar', { length: 100, nullable: true })
  custom_product_id: string;
}

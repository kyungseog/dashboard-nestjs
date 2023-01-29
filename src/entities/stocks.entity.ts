import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Stocks extends BaseEntity {
  @Column('varchar')
  seller_name: string;

  @Column('char', { length: 50, nullable: true })
  seller_id: string;

  @Column('varchar', { nullable: true })
  custom_product_id: string;

  @PrimaryColumn('char', { length: 50 })
  barcode: string;

  @Column('varchar', { nullable: true })
  custom_variant_id: string;

  @Column('varchar')
  product_name: string;

  @Column('varchar', { nullable: true })
  option_name: string;

  @Column('int')
  quantity: number;

  @Column('int')
  non_delivery_order: number;

  @Column('int')
  usable_quantity: number;

  @Column('int', { nullable: true })
  cost: number;

  @Column('int', { nullable: true })
  total_cost: number;
}

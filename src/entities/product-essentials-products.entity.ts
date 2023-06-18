import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductEssentialsProducts extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  custom_product_id: string;

  @Column('varchar', { nullable: true })
  product_custom_name: string;

  @Column('char', { length: 50, nullable: true })
  target: string;

  @Column('char', { length: 50, nullable: true })
  category: string;

  @Column('char', { length: 50, nullable: true })
  season: string;

  @Column('char', { length: 50, nullable: true })
  material: string;

  @Column('char', { length: 50, nullable: true })
  design: string;

  @Column('char', { length: 50, nullable: true })
  gender: string;

  @Column('char', { length: 50, nullable: true })
  style: string;

  @Column('char', { length: 10, nullable: true })
  plan_year: string;

  @Column('int', { nullable: true })
  fixed_price: number;

  @Column('int', { nullable: true })
  sales_price: number;

  @Column('date', { nullable: true })
  first_sale_date: Date;
}

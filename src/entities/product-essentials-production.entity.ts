import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductEssentialsProduction extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  barcode: string;

  @Column('varchar', { length: 100, nullable: true })
  custom_variant_id: string;

  @PrimaryColumn('varchar', { length: 100 })
  custom_cost_id: string;

  @Column('int', { nullable: true })
  pre_cost: number;

  @Column('int', { nullable: true })
  post_cost: number;

  @Column('int', { nullable: true })
  in_quantity: number;

  @Column('varchar', { length: 100, nullable: true })
  color: string;

  @Column('char', { length: 50, nullable: true })
  size: string;

  @Column('char', { length: 50, nullable: true })
  age: string;

  @Column('char', { length: 50, nullable: true })
  category: string;

  @Column('char', { length: 10, nullable: true })
  plan_year: string;

  @Column('char', { length: 50, nullable: true })
  season: string;

  @Column('char', { length: 50, nullable: true })
  material: string;

  @Column('date', { nullable: true })
  first_sale_date: Date;
}

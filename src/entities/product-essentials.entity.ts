import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductEssentials extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  product_id: string;

  @PrimaryColumn('varchar', { length: 100 })
  product_variant_id: string;

  @Column('varchar', { length: 100, nullable: true })
  custom_variant_id: string;

  @Column('int', { nullable: true })
  variant_cost: number;

  @Column('varchar', { nullable: true })
  product_name: string;

  @PrimaryColumn('varchar', { length: 100 })
  bar_code: string;

  @Column('int', { nullable: true })
  unique_codst: number;

  @Column('varchar', { length: 100, nullable: true })
  color: string;

  @Column('varchar', { length: 100, nullable: true })
  size: string;

  @Column('varchar', { length: 100, nullable: true })
  age: string;

  @Column('varchar', { length: 100, nullable: true })
  category: string;

  @Column('char', { length: 10, nullable: true })
  plan_year: string;

  @Column('char', { length: 50, nullable: true })
  season: string;
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Costs extends BaseEntity {
  @Column('char', { length: 50 })
  product_id: string;

  @PrimaryColumn('char', { length: 50 })
  product_variant_id: string;

  @Column('varchar', { length: 200, nullable: true })
  custom_variant_id: string;

  @Column('int')
  cost: number;
}

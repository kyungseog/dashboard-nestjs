import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CostIds extends BaseEntity {
  @PrimaryColumn('char', { length: 50 })
  barcode: string;

  @Column('varchar', { nullable: true })
  custom_variant_id: string;

  @Column('varchar', { nullable: true })
  product_variant_id: string;

  @Column('varchar', { nullable: true })
  id: string;
}

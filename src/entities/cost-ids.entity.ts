import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Costs extends BaseEntity {
  @PrimaryColumn('char', { length: 50 })
  id: string;

  @Column('char', { length: 50 })
  custom_variant_id: string;

  @Column('char', { length: 50 })
  barcode: string;
}

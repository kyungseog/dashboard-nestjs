import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { BrandType, SquadType, SupplierStatus } from './enums';

@Entity()
export class Brands extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('varchar')
  brand_name: string;

  @Column({ type: 'enum', enum: BrandType })
  account_type: BrandType;

  @Column('char', { nullable: true, length: 100 })
  class_type: string;

  @Column('char', { length: 50 })
  sales_country: string;

  @Column({ type: 'enum', enum: SquadType })
  squad: SquadType;

  @Column('char', { nullable: true, length: 50 })
  manager_id: string;

  @Column('char', { length: 10 })
  supplier_id: string;

  @Column('varchar', { nullable: true, length: 100 })
  supplier_md_email: string;

  @Column('char', { length: 10 })
  commission: string;

  @Column('date')
  created_at: Date;

  @Column('date')
  deleted_at: Date;

  @Column({ type: 'enum', enum: SupplierStatus })
  status_id: SupplierStatus;

  @Column('varchar', { nullable: true, length: 100 })
  profit_cell: string;
}

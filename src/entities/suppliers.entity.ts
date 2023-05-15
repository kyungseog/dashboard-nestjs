import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SupplierStatus, TaxType } from './enums';

@Entity()
export class Suppliers extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { length: 10 })
  integration_id: string;

  @Column('varchar')
  integration_name: string;

  @Column('varchar')
  supplier_name: string;

  @Column('varchar', { nullable: true })
  ceo: string;

  @Column('varchar', { nullable: true })
  registration_id: string;

  @Column('char', { length: 50, nullable: true })
  account_type: string;

  @Column({ type: 'enum', enum: TaxType, nullable: true })
  tax_type: TaxType;

  @Column('int', { nullable: true })
  account_count: number;

  @Column('char', { length: 50, nullable: true })
  bank_name: string;

  @Column('char', { length: 50, nullable: true })
  bank_account: string;

  @Column('varchar', { nullable: true })
  account_owner: string;

  @Column('varchar', { nullable: true })
  account_email: string;

  @Column({ type: 'enum', enum: SupplierStatus })
  status_id: SupplierStatus;
}

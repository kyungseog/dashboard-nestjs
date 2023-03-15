import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SupplierStatus } from './enums';

@Entity()
export class Suppliers extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { length: 10 })
  integration_id: string;

  @Column('varchar')
  integration_name: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  ceo: string;

  @Column('varchar', { nullable: true })
  registration_id: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column({ type: 'enum', enum: SupplierStatus })
  status_id: SupplierStatus;
}

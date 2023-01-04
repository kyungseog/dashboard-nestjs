import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { BrandType } from './enums';

@Entity()
export class Brands extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'enum', enum: BrandType })
  type: BrandType;

  @Column('char', { nullable: true, length: 10 })
  manager_id: string;

  @Column('char', { length: 10 })
  supplier_id: string;

  @Column('char', { length: 10 })
  commission: string;

  @Column('date')
  created_at: Date;

  @Column('char', { length: 10 })
  status_id: string;
}

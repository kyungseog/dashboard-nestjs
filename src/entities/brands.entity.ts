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

  @Column('char', { length: 10 })
  manager_id: string;

  @Column('int')
  supplier_id: number;

  @Column('char')
  commission: string;
}

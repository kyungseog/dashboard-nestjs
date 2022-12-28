import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { BrandType } from './enums';

@Entity()
export class Brands extends BaseEntity {
  @PrimaryColumn('char')
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'enum', enum: BrandType })
  type: BrandType;

  @Column('char')
  manager_id: string;

  @Column('int')
  supplier_id: number;

  @Column('char')
  commission: string;
}

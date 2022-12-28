import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BrandType } from './enums';
import { Managers } from './managers.entity';

@Entity()
export class Brands extends BaseEntity {
  @PrimaryColumn('char')
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'enum', enum: BrandType })
  type: BrandType;

  @ManyToOne(() => Managers, (manager_id) => 'char')
  manager_id: string;

  @Column('int')
  supplier_id: number;

  @Column('char')
  commission: string;
}

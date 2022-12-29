import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CostType } from './enums';

@Entity()
export class JapanExpenses extends BaseEntity {
  @PrimaryColumn({ type: 'enum', enum: CostType })
  class: CostType;

  @Column('int')
  cost: number;

  @PrimaryColumn('date')
  issued_at: Date;
}

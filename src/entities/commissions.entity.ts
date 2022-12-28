import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CommissionGrade } from './enums';

@Entity()
export class Commissions extends BaseEntity {
  @PrimaryColumn('char')
  id: string;

  @Column({ type: 'enum', enum: CommissionGrade })
  grade: CommissionGrade;

  @Column('float')
  rate: number;
}

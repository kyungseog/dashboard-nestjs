import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SquadType } from './enums';

@Entity()
export class KoreaBudget extends BaseEntity {
  @PrimaryColumn({ type: 'enum', enum: SquadType })
  squad: SquadType;

  @PrimaryColumn('date')
  date: Date;

  @Column('bigint')
  sale_sales: number;

  @Column('int')
  coupon: number;

  @Column('int', { nullable: true })
  commission: number;

  @Column('int', { nullable: true })
  cost: number;

  @Column('int')
  pg_fee: number;

  @Column('int')
  marketing_fee: number;

  @Column('bigint')
  marketing_conversion: number;

  @Column('int')
  outsourcing_fee: number;

  @Column('int', { nullable: true })
  logistic_variable_fee: number;

  @Column('int', { nullable: true })
  logistic_fixed_fee: number;

  @Column('int')
  operation_fixed_fee: number;
}

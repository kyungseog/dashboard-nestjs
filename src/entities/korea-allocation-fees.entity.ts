import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Account } from './enums';

@Entity()
export class KoreaAllocationFees extends BaseEntity {
  @PrimaryColumn('date')
  created_at: Date;

  @PrimaryColumn({ type: 'enum', enum: Account })
  account: Account;

  @PrimaryColumn('char', { length: 50 })
  brand_id: string;

  @Column('int')
  allocated_fee: number;
}

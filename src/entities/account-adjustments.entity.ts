import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AccountAdjustments extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  brand_id: string;

  @Column('int')
  adjust_fee: number;

  @Column('varchar')
  adjust_reason: string;

  @PrimaryColumn('date')
  issued_at: Date;
}

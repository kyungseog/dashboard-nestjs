import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CouponType } from './enums';

@Entity()
export class KoreaCoupons extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @PrimaryColumn('varchar')
  order_id: string;

  @Column('varchar')
  order_item_id: string;
}

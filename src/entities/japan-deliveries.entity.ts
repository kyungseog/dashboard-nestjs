import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { JapanDeliveryFeeType } from './enums';

@Entity()
export class JapanDeliveries extends BaseEntity {
  @PrimaryColumn('char', { length: 20 })
  tracking_no: string;

  @Column('float')
  actual_weight: number;

  @Column('float')
  volume_weight: number;

  @Column('float')
  adobt_weight: number;

  @Column('int')
  cost: number;

  @Column({ type: 'enum', enum: JapanDeliveryFeeType })
  class: JapanDeliveryFeeType;
}

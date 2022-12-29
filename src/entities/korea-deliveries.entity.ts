import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaDeliveries extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  order_id: string;

  @Column('varchar')
  tracking_no: string;

  @Column('int')
  cost: number;
}

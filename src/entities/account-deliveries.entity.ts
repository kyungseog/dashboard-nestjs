import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AccountDeliveries extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column('char', { length: 10 })
  order_id: string;

  @Column('int')
  cost: number;

  @Column('date')
  issued_at: Date;
}

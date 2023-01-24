import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JapanOrders extends BaseEntity {
  @PrimaryColumn('varchar')
  order_item_id: string;

  @Column('varchar')
  id: string;

  @Column('datetime')
  order_date: Date;

  @Column('datetime')
  payment_date: Date;

  @Column('datetime', { nullable: true })
  delivery_date: Date;

  @Column('varchar', { length: 50 })
  product_id: string;

  @Column('varchar', { length: 50 })
  product_variant_id: string;

  @Column('int')
  fixed_price: number;

  @Column('int')
  sale_price: number;

  @Column('int')
  discount_price: number;

  @Column('int')
  quantity: number;

  @Column('varchar', { nullable: true })
  user_id: string;

  @Column('char', { length: 10 })
  status_id: string;

  @Column('float')
  commission_rate: number;

  @Column('int')
  deposit: number;

  @Column('int')
  mileage: number;

  @Column('int')
  order_coupon: number;

  @Column('int')
  product_coupon: number;

  @Column('char', { length: 10 })
  channel: string;

  @Column('int')
  payment_price: number;

  @Column('char', { length: 50, nullable: true })
  user_group: string;

  @Column('char', { length: 10 })
  is_first: string;
}

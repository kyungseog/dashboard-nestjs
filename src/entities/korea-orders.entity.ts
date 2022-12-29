import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { OrderStatus } from './enums';

@Entity()
export class KoreaOrders extends BaseEntity {
  @PrimaryColumn('varchar')
  order_item_id: string;

  @Column('varchar')
  id: string;

  @Column('datetime')
  order_date: Date;

  @Column('datetime')
  payment_date: Date;

  @Column('datetime')
  delivery_date: Date;

  @Column('char', { length: 10 })
  product_variant_id: string;

  @Column('int')
  fixed_price: number;

  @Column('int')
  sale_price: number;

  @Column('int')
  discount_price: number;

  @Column('int')
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column('varchar')
  user_id: string;
}

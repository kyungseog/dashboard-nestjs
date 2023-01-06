import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { TaxType } from './enums';

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

  @Column('datetime', { nullable: true })
  delivery_date: Date;

  @Column('varchar', { length: 50 })
  product_variant_id: string;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column('int')
  fixed_price: number;

  @Column('int')
  sale_price: number;

  @Column('int')
  discount_price: number;

  @Column('int')
  quantity: number;

  @Column('char', { length: 10 })
  status_id: string;

  @Column({ type: 'enum', enum: TaxType })
  tax_type: TaxType;

  @Column('varchar', { nullable: true })
  user_id: string;
}

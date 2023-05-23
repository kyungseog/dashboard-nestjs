import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DayKoreaBrands extends BaseEntity {
  @PrimaryColumn('date')
  payment_date: Date;

  @PrimaryColumn('char', { length: 50 })
  brand_id: string;

  @Column('varchar', { length: 255 })
  brand_name: string;

  @Column('char', { length: 50 })
  account_type: string;

  @Column('char', { length: 50 })
  supplier_id: string;

  @Column('varchar', { length: 255 })
  supplier_name: string;

  @Column('int')
  order_count: number;

  @Column('int')
  quantity: number;

  @Column('int')
  sales: number;

  @Column('int')
  commission: number;

  @Column('int')
  cost: number;

  @Column('int')
  order_coupon: number;

  @Column('int')
  product_coupon: number;

  @Column('int')
  mileage: number;

  @Column('int')
  pg_fee: number;

  @Column('int')
  direct_marketing_fee: number;

  @Column('int')
  indirect_marketing_fee: number;

  @Column('int')
  logistic_fee: number;

  @Column('int')
  contribution_margin: number;
}

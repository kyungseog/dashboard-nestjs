import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CountryType, TaxType } from './enums';

@Entity()
export class AccountOrders extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  order_item_id: string;

  @Column('char', { length: 10 })
  brand_id: string;

  @Column({ type: 'enum', enum: CountryType })
  country: CountryType;

  @Column({ type: 'enum', enum: TaxType })
  tax_type: TaxType;

  @Column('int')
  quantity: number;

  @Column('int')
  fixed_price: number;

  @Column('int')
  account_sale_price: number;

  @Column('float')
  commission_rate: number;

  @Column('int')
  commission_fee: number;

  @Column('int')
  company_paid: number;

  @Column('date')
  issued_at: Date;
}
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { CountryType, TaxType } from './enums';

@Entity()
export class AccountOrdersConsignment extends BaseEntity {
  @PrimaryColumn('varchar', { length: 100 })
  order_item_id: string;

  @Column('char', { length: 50, nullable: true })
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

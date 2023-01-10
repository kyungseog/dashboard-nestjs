import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductVariants extends BaseEntity {
  @PrimaryColumn('char', { length: 20 })
  id: string;

  @Column('varchar', { nullable: true })
  custom_variant_id: string;

  @Column('varchar', { nullable: true })
  variant_color: string;

  @Column('varchar', { nullable: true })
  variant_size: string;

  @Column('varchar', { nullable: true })
  variant_etc1: string;

  @Column('varchar', { nullable: true })
  variant_etc2: string;

  @Column('char', { length: 10 })
  product_id: string;

  @Column('int')
  option_price: number;

  @Column('datetime')
  updated_at: Date;

  @Column('varchar', { nullable: true })
  cafe_variant_code: string;
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProductCategories extends BaseEntity {
  @PrimaryColumn('char', { length: 50 })
  category_id: string;

  @PrimaryColumn('char', { length: 50 })
  product_id: string;

  @Column('char', { length: 50 })
  brand_id: string;
}

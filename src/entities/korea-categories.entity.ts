import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaCategories extends BaseEntity {
  @PrimaryColumn('char', { length: 50 })
  id: string;

  @Column('char', { length: 100 })
  name: string;

  @Column('char', { length: 10 })
  display_flag: string;

  @Column('char', { length: 10 })
  display_mobile_flag: string;

  @Column('char', { length: 10 })
  check_products: string;
}

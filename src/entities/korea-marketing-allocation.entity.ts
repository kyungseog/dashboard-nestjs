import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaMarketing extends BaseEntity {
  @PrimaryColumn('date')
  created_at: Date;

  @PrimaryColumn('char', { length: 50 })
  brand_id: string;

  @Column('int')
  allocated_marketing_fee: number;
}

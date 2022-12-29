import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaMileages extends BaseEntity {
  @PrimaryColumn('varchar')
  user_id: string;

  @PrimaryColumn('varchar')
  order_id: string;

  @Column('int')
  mileage_increase: number;

  @Column('int')
  mileage_decrease: number;

  @Column('int')
  mileage_total: number;

  @Column('datetime')
  issued_at: Date;
}

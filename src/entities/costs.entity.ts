import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Costs extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  variant_id: string;

  @Column('char', { length: 10 })
  id: string;

  @Column('int')
  standard_cost: number;

  @Column('int')
  actual_cost: number;

  @Column('datetime')
  issued_at: Date;
}

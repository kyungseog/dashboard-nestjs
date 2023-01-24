import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Costs extends BaseEntity {
  @PrimaryColumn('date')
  issued_at: Date;

  @PrimaryColumn('char', { length: 50 })
  id: string;

  @Column('int')
  standard_cost: number;

  @Column('int')
  actual_cost: number;
}

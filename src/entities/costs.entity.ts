import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Costs extends BaseEntity {
  @PrimaryColumn('date')
  issued_at: Date;

  @PrimaryColumn('varchar', { length: 200 })
  id: string;

  @Column('int')
  cost: number;
}

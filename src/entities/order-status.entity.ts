import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderStatus extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('varchar')
  name: string;
}

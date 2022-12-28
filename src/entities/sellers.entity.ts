import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Sellers extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('varchar')
  name: string;
}

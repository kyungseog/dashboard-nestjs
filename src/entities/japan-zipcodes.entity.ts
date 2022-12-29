import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JapanZipcodes extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('varchar')
  location: string;
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Squads extends BaseEntity {
  @PrimaryColumn('char', { length: 100 })
  id: string;

  @Column('varchar')
  name: string;
}

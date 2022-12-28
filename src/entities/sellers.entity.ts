import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Sellers extends BaseEntity {
  @PrimaryColumn('char')
  id: string;

  @Column('varchar')
  name: string;
}

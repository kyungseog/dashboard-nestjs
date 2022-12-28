import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Managers extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column('char', { length: 10 })
  password: string;

  @Column('char', { length: 10 })
  partname: string;

  @Column('char', { length: 10 })
  position: string;

  @Column('char', { length: 10 })
  name: string;

  @Column('text')
  introduction: string;
}

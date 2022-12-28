import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Managers extends BaseEntity {
  @PrimaryColumn('char')
  id: string;

  @Column('char')
  password: string;

  @Column('char')
  partname: string;

  @Column('char')
  position: string;

  @Column('char')
  name: string;

  @Column('text')
  introduction: string;
}

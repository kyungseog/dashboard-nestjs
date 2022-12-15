import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  partname: string;

  @Column()
  position: string;

  @Column()
  name: string;

  @Column('text')
  introduction: string;
}

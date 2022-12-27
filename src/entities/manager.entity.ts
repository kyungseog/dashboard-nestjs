import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Manager extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  password: string;

  @Column()
  partname: string;

  @Column()
  position: string;

  @Column()
  name: string;

  @Column('text')
  introduction: string;
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JapanUsers extends BaseEntity {
  @PrimaryColumn('char')
  id: string;

  @Column('datetime')
  created_at: Date;
}

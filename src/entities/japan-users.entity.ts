import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JapanUsers extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('datetime')
  created_at: Date;
}

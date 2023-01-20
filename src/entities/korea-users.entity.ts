import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class KoreaUsers extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('datetime')
  created_at: Date;

  @Column('datetime', { nullable: true })
  updated_at: Date;
}

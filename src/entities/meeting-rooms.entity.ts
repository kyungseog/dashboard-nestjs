import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MeetingRooms extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('datetime')
  start_date: Date;

  @Column('datetime')
  end_date: Date;

  @Column('char')
  creator: string;

  @Column('char')
  room_no: string;

  @Column('text')
  summary: string;
}

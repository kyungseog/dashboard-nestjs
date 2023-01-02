import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MeetingRooms extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('datetime')
  start_date: Date;

  @Column('datetime')
  end_date: Date;

  @Column('char', { length: 20 })
  creator: string;

  @Column('char', { length: 10 })
  room_no: string;

  @Column('text')
  summary: string;
}

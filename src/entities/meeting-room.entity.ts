import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MeetingRoom extends BaseEntity {
  @PrimaryColumn()
  booking_id: string;

  @Column()
  meeting_room_id: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  creator: string;

  @Column('text')
  summary: string;
}

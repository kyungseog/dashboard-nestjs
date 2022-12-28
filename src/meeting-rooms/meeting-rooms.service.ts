import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRooms } from '../entities/meeting-rooms.entity';

@Injectable()
export class MeetingRoomsService {
  constructor(
    @InjectRepository(MeetingRooms)
    private meetingRoomRepository: Repository<MeetingRooms>,
  ) {}

  async getRoomByDate(date: Date): Promise<MeetingRooms[]> {
    const found = await this.meetingRoomRepository
      .createQueryBuilder()
      .where('DATE(start_date) = :date', { date })
      .getMany();
    if (!found) {
      throw new NotFoundException(`can't find Meeting Room with Date ${date}`);
    }
    return found;
  }
}

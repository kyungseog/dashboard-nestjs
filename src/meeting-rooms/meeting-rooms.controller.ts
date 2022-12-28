import { Controller, Get, Param } from '@nestjs/common';
import { MeetingRoom } from '../entities/meeting-rooms.entity';
import { MeetingRoomsService } from './meeting-rooms.service';

@Controller('meeting-rooms')
export class MeetingRoomsController {
  constructor(private meetingRoomsService: MeetingRoomsService) {}

  @Get('/:date')
  getRoomByDate(@Param('date') date: Date): Promise<MeetingRoom[]> {
    return this.meetingRoomsService.getRoomByDate(date);
  }
}

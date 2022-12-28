import { Controller, Get, Param } from '@nestjs/common';
import { MeetingRooms } from '../entities/meeting-rooms.entity';
import { MeetingRoomsService } from './meeting-rooms.service';

@Controller('meeting-rooms')
export class MeetingRoomsController {
  constructor(private meetingRoomsService: MeetingRoomsService) {}

  @Get('/:date')
  getRoomByDate(@Param('date') date: Date): Promise<MeetingRooms[]> {
    return this.meetingRoomsService.getRoomByDate(date);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRooms } from '../entities/meeting-rooms.entity';
import { MeetingRoomsController } from './meeting-rooms.controller';
import { MeetingRoomsService } from './meeting-rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRooms])],
  controllers: [MeetingRoomsController],
  providers: [MeetingRoomsService],
})
export class MeetingRoomsModule {}

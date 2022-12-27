import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from '../entities/meeting-room.entity';
import { MeetingRoomsController } from './meeting-rooms.controller';
import { MeetingRoomsService } from './meeting-rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  controllers: [MeetingRoomsController],
  providers: [MeetingRoomsService],
})
export class MeetingRoomsModule {}

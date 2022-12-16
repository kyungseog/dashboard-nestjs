import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { MeetingRoomsModule } from './meeting-rooms/meeting-rooms.module';
import { MeetingRoom } from './meeting-rooms/meeting-room.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, MeetingRoom],
      synchronize: false,
    }),
    UsersModule,
    MeetingRoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

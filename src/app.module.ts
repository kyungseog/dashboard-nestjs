import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagersModule } from './managers/managers.module';
import { MeetingRoomsModule } from './meeting-rooms/meeting-rooms.module';
import { LiveCommercesModule } from './live-commerces/live-commerces.module';
import { JapanModule } from './japan/japan.module';

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
      entities: ['entities/*.entity.ts'],
      synchronize: true,
    }),
    ManagersModule,
    MeetingRoomsModule,
    LiveCommercesModule,
    JapanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

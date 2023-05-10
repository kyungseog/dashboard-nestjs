import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagersModule } from './managers/managers.module';
import { MeetingRoomsModule } from './meeting-rooms/meeting-rooms.module';
import { LiveCommercesModule } from './live-commerces/live-commerces.module';
import { JapanModule } from './japan/japan.module';
import { KoreaModule } from './korea/korea.module';
import { AccountingModule } from './accounting/accounting.module';
import { ormConfig } from './orm.config';
import { WeatherModule } from './weather/weather.module';
import { PartnersModule } from './partners/partners.module';
import { SquadsModule } from './squads/squads.module';
import { BrandsModule } from './brands/brands.module';
import { EssentialModule } from './mmz-essential/mmz-essential.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ManagersModule,
    MeetingRoomsModule,
    LiveCommercesModule,
    JapanModule,
    KoreaModule,
    AccountingModule,
    WeatherModule,
    PartnersModule,
    SquadsModule,
    BrandsModule,
    EssentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventController } from './event.controller';
import { EventEnt } from './event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EventEnt, Attendee]),],
    controllers: [EventController]
})
export class EventsModule {}

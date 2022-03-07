import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventController } from './event.controller';
import { EventEnt } from './event.entity';
import { EventService } from './event.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventEnt, Attendee]),],
    controllers: [EventController],
    providers: [EventService]
})
export class EventsModule {}

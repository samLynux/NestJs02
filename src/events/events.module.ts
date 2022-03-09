import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendant.controller';
import { EventAttendeeControlller } from './event-attendees.controller';
import { EventController } from './event.controller';
import { EventEnt } from './event.entity';
import { EventService } from './event.service';
import { EventsOrganizedByUser } from './events-organized-by-user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EventEnt, Attendee]),],
    controllers: [
        EventController, 
        EventAttendeeControlller,
        EventsOrganizedByUser,
        CurrentUserEventAttendanceController,
    ],
    providers: [EventService, AttendeeService]
})
export class EventsModule {}

import { ClassSerializerInterceptor, Controller, Get, Param, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { AttendeeService } from "./attendees.service";

@Controller('events/:eventId/attendee')
@SerializeOptions({strategy:'excludeAll'})
export class EventAttendeeControlller{
    constructor(
        private readonly attendeeService:AttendeeService
    ){}


    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('eventId') eventId: number) {
        const attendees = await this.attendeeService.findByEventId(eventId);
    
        return attendees;
      }
}
import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";

import { EventService } from "./event.service";

@Controller('events-organized-by-user/:userId')
@SerializeOptions({strategy:'excludeAll'})
export class EventsOrganizedByUser{
    constructor(
        private readonly eventService:EventService
    ){}


    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('userId',ParseIntPipe) userId: number, @Query('page',new DefaultValuePipe(1),ParseIntPipe) page = 1) {
        const attendees = await this.eventService.getEventsOrganizedByUserIdPaginated(
            userId,
            {
                currentPage: page, limit: 5
            }
        );
    
        return attendees;
      }
}
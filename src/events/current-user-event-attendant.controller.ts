import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AttendeeService } from "./attendees.service";
import { EventService } from "./event.service";
import { CreateAttendeeDTO } from "./input/create-attendee.dto";

@Controller('events-attendance')
@SerializeOptions({strategy:'excludeAll'})
export class CurrentUserEventAttendanceController{
    constructor(
        private readonly eventService:EventService,
        private readonly attendeeService:AttendeeService
    ){}


    @Get()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll( @CurrentUser() user:User,  @Query('page') page = 1) {
        return await this.eventService.getEventsAttendedByUserIdPaginated(
            user.id,{limit: 6,  currentPage: page}
        );
    
        
    }

    @Get(':eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('eventId', ParseIntPipe) eventId: number, @CurrentUser() user:User) {
        const attendees = await this.attendeeService.findOneByEventIdAndUserId(eventId, user.id);
    
        if(!attendees){
            throw new NotFoundException();
        }
        return attendees;
    }

    @Put(':eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdate(@Param('eventId', ParseIntPipe) eventId: number, 
        @Body() input: CreateAttendeeDTO, @CurrentUser() user:User) {
        

        return this.attendeeService.createOrUpdate(input,eventId,user.id);
    }
}
import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { EventService } from './event.service';
import { CreateEventDTO } from './input/create-event.dto';
import { ListEvents } from './input/list.events';
import { UpdateEventDTO } from './input/update-event.dto';

@Controller('events')
@SerializeOptions({strategy:'excludeAll'})
export class EventController {
  private readonly logger = new Logger(EventController.name);
  constructor(
    // @InjectRepository(EventEnt)
    // private readonly repository: Repository<EventEnt>,
    // @InjectRepository(Attendee)
    // private readonly attendeerepository: Repository<Attendee>,
    private readonly eventService:EventService
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({transform: true}))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        { 
          total:true,
          currentPage: filter.page,
          limit:10
        }
        );

    return events
  }

  // @Get('/practice')
  // async practice() {
  //   return await this.repository.find({
  //     select: ['id', 'when'],
  //     where: [{
  //       id: MoreThan(3),
  //       when: MoreThan(new Date('2021-02-12T13:00:00'))
  //     },{
  //       description: Like('%meet%')
  //     }],
  //     take: 2,
  //     order: {
  //       id: 'DESC'
  //     }
  //   });
  // } 

  // @Get('/practice2')
  // async practice2() {
  //   const event = await this.repository.findOne(1,{
  //     relations: ['attendees']
  //   });

  //   const attendee = new Attendee()
  //   attendee.name = "cascade";
  //   //attendee.event = event;

  //   event.attendees.push(attendee);
  //   await this.repository.save(event);

  //   return event;
  // } 

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    
    const event = await this.eventService.getEventWithAttendeeCount(id)


    if(!event){
      throw new NotFoundException();
    }


    return event;
  }




  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDTO, @CurrentUser() user:User) {
    return await this.eventService.createEvent(input,user)
    
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Param('id',ParseIntPipe) id, @Body() input: UpdateEventDTO, @CurrentUser() user:User) {
    const event = await this.eventService.findOne(id)
    if(!event){
      throw new NotFoundException();
    }

    if(event.organizerId !== user.id){
      throw new ForbiddenException(null, "You not authorized to update");
    }


    return await this.eventService.updateEvent(input,event);

  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id',ParseIntPipe) id, @CurrentUser() user:User) {
    const event = await this.eventService.findOne(id)
    if(!event){
      throw new NotFoundException();
    }

    if(event.organizerId !== user.id){
      throw new ForbiddenException(null, "You not authorized to delete");
    }


     await this.eventService.deleteEvent(id);


  }

}

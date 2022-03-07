import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';

import {  EventEnt } from './event.entity';
import { EventService } from './event.service';
import { CreateEventDTO } from './input/create-event.dto';
import { ListEvents } from './input/list.events';
import { UpdateEventDTO } from './input/update-event.dto';

@Controller('events')
export class EventController {
  private readonly logger = new Logger(EventController.name);
  constructor(
    @InjectRepository(EventEnt)
    private readonly repository: Repository<EventEnt>,
    @InjectRepository(Attendee)
    private readonly attendeerepository: Repository<Attendee>,
    private readonly eventService:EventService
  ) {}

  @Get()
  async findAll(@Query() filter: ListEvents) {
    this.logger.log('Hit the findall route')
    const events = await this.eventService.getEventsWithAttendeeCountFiltered(filter);
    this.logger.debug(`Found ${events.length} events`)
    return events
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [{
        id: MoreThan(3),
        when: MoreThan(new Date('2021-02-12T13:00:00'))
      },{
        description: Like('%meet%')
      }],
      take: 2,
      order: {
        id: 'DESC'
      }
    });
  } 

  @Get('/practice2')
  async practice2() {
    const event = await this.repository.findOne(1,{
      relations: ['attendees']
    });

    const attendee = new Attendee()
    attendee.name = "cascade";
    //attendee.event = event;

    event.attendees.push(attendee);
    await this.repository.save(event);

    return event;
  } 

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    
    const event = await this.eventService.getEvent(id)


    if(!event){
      throw new NotFoundException();
    }


    return event;
  }




  @Post()
  async create(@Body() input: CreateEventDTO) {
    const event = await this.repository.save({
      ...input,
      when: new Date(input.when),
    })
    return event;
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDTO) {
    const event = await this.repository.findOne(id)
    if(!event){
      throw new NotFoundException();
    }


    return await this.repository.save( {
      ...event,
      ...input,
      when: input.when ?  new Date(input.when) : event.when,
    });

  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOne(id); 

    if(!event){
      throw new NotFoundException();
    }

    await this.repository.remove(event);
    return event;
  }

}

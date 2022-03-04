import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateEventDTO } from './create-event.dto';
import {  EventEnt } from './event.entity';
import { UpdateEventDTO } from './update-event.dto';

@Controller('events')
export class EventController {
  private events: EventEnt[] = [];
  constructor() {}

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    const event = this.events.find(event => event.id === parseInt(id))
    return event;
  }

  @Post()
  create(@Body() input: CreateEventDTO) {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length+1
    }
    this.events.push(event);
    return event;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDTO) {
    const index = this.events.findIndex(event => event.id === parseInt(id));
    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ?  new Date(input.when) : this.events[index].when,
    }

    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    this.events = this.events.filter(event => event.id !== parseInt(id));
    return this.events;
  }

}

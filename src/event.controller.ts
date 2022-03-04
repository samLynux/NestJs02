import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDTO } from './create-event.dto';
import {  EventEnt } from './event.entity';
import { UpdateEventDTO } from './update-event.dto';

@Controller('events')
export class EventController {
  //private events: EventEnt[] = [];
  constructor(
    @InjectRepository(EventEnt)
    private readonly repository: Repository<EventEnt>
  ) {}

  @Get()
  async findAll() {
    return await this.repository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    const event = await this.repository.findOne(id)
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
    await this.repository.remove(event);
    return event;
  }

}

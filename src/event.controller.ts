import { Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

@Controller('events')
export class EventController {
  constructor() {}

  @Get()
  findAll() {
    
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return id;
  }

  @Post()
  create() {
    return "bye";
  }

  @Patch(':id')
  update(@Param('id') id) {
    return "bye";
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return "bye";
  }

}

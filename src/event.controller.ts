import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateEventDTO } from './create-event.dto';

@Controller('events')
export class EventController {
  constructor() {}

  @Get()
  findAll() {
    return [
      { id: 1, name: "1st" },
      { id: 2, name: "2nd" },
    ];
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return  { id: 1, name: "1st" };
  }

  @Post()
  create(@Body() input: CreateEventDTO) {
    return input;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input) {
    return input;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    return "bye";
  }

}

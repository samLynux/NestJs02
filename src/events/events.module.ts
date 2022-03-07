import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventEnt } from './event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EventEnt]),],
    controllers: [EventController]
})
export class EventsModule {}

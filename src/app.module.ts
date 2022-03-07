import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { EventEnt } from './events/event.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'example',
      database: 'nest-events',
      entities: [
        EventEnt
      ],
      synchronize: true,
    }),
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

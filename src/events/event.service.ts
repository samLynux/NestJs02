
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEnt } from './event.entity';

@Injectable()
export class EventService {
private readonly logger = new Logger(EventService.name);
  constructor(
      @InjectRepository(EventEnt)
      private readonly eventsRepository: Repository<EventEnt>
  ){}


  private getEventsBasedQuery(){
      return this.eventsRepository
        .createQueryBuilder('e')
        .orderBy('e.id','DESC');
  }

  public async getEvent(id:number): Promise<EventEnt | undefined>{
    const query =   this.getEventsBasedQuery()
        .andWhere('e.id = :id',  {id});

    this.logger.debug(query.getSql());
    return await query.getOne();
}
}


import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
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

    public  getEventWithAttendeeCountQuery(){
        return this.getEventsBasedQuery()
            .loadRelationCountAndMap('e.attendeeCount',  'e.attendees')
            .loadRelationCountAndMap('e.attendeeAccepted','e.attendees','attendee', 
                (qb) => qb.where('attendee.answer = :answer', 
                    {answer: AttendeeAnswerEnum.accepted}))
            .loadRelationCountAndMap('e.attendeeMaybe','e.attendees','attendee', 
                (qb) => qb.where('attendee.answer = :answer', 
                        {answer: AttendeeAnswerEnum.maybe}))
            .loadRelationCountAndMap('e.attendeeRejected','e.attendees','attendee', 
                (qb) => qb.where('attendee.answer = :answer', 
                    {answer: AttendeeAnswerEnum.rejected}))

 
    }

    public async getEvent(id:number): Promise<EventEnt | undefined>{
        const query =   this.getEventWithAttendeeCountQuery()
            .andWhere('e.id = :id',  {id});

        this.logger.debug(query.getSql());
        return await query.getOne();
    }
}

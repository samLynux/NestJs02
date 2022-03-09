
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { paginate, paginateOptions } from 'src/pagination/paginator';
import { DeleteResult, Repository } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { EventEnt } from './event.entity';
import { CreateEventDTO } from './input/create-event.dto';
import { ListEvents, WhenEventFilter } from './input/list.events';

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

    private async getEventsWithAttendeeCountFiltered(filter?:ListEvents){
        let query =   this.getEventWithAttendeeCountQuery();

        if(!filter){
            return query;
        }

        if(filter.when){
            
            
            if(filter.when == WhenEventFilter.Today){
                query = query.andWhere('e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY')
            }
            if(filter.when == WhenEventFilter.Tomorrow){
                query = query.andWhere('e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 1 DAY')
            }
            if(filter.when == WhenEventFilter.ThisWeek){
                //console.log(filter.when);
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)')
            }
            if(filter.when == WhenEventFilter.NextWeek){
                
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1')
            }
        }
        
        return await query;
    }

    public async getEventsWithAttendeeCountFilteredPaginated(
        filter:ListEvents, paginateOptions:paginateOptions){
        
        return await paginate(
            await this.getEventsWithAttendeeCountFiltered(filter),
            paginateOptions
        );
    }

    public async getEvent(id:number): Promise<EventEnt | undefined>{
        const query =   this.getEventWithAttendeeCountQuery()
            .andWhere('e.id = :id',  {id});

        this.logger.debug(query.getSql());
        return await query.getOne();
    }

    public async createEvent(input:CreateEventDTO, user:User): Promise<EventEnt>{
        
        return await this.eventsRepository.save({
            ...input,
            organizer: user,
            when: new Date(input.when)
        })
    }

    public async deleteEvent(id:number): Promise<DeleteResult>{
        
        return await this.eventsRepository.createQueryBuilder('e')
            .delete().where('id = :id', {id}).execute();
    }
}

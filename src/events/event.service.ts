
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../auth/user.entity';
import { paginate, paginateOptions } from './../pagination/paginator';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { EventEnt, paginatedEvents } from './event.entity';
import { CreateEventDTO } from './input/create-event.dto';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { UpdateEventDTO } from './input/update-event.dto';

@Injectable()
export class EventService {
private readonly logger = new Logger(EventService.name);
  constructor(
      @InjectRepository(EventEnt)
      private readonly eventsRepository: Repository<EventEnt>
  ){}


  private getEventsBasedQuery():SelectQueryBuilder<EventEnt>{
      return this.eventsRepository
        .createQueryBuilder('e')
        .orderBy('e.id','DESC');
  }

    public  getEventWithAttendeeCountQuery():SelectQueryBuilder<EventEnt>{
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

    private getEventsWithAttendeeCountFilteredQuery(filter?:ListEvents)
            :SelectQueryBuilder<EventEnt>{
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
        
        return query;
    }

    public async getEventsWithAttendeeCountFilteredPaginated(
        filter:ListEvents, paginateOptions:paginateOptions):Promise<paginatedEvents>{
        
        return await paginate(
            await this.getEventsWithAttendeeCountFilteredQuery(filter),
            paginateOptions
        );
    }

    public async getEventWithAttendeeCount(id:number): Promise<EventEnt | undefined>{
        const query =   this.getEventWithAttendeeCountQuery()
            .andWhere('e.id = :id',  {id});

        this.logger.debug(query.getSql());
        return await query.getOne();
    }

    
    public async findOne(id:number): Promise<EventEnt | undefined>{
        
        return await this.eventsRepository.findOne(id)
    }

    public async createEvent(input:CreateEventDTO, user:User): Promise<EventEnt>{
        
        return await this.eventsRepository.save(
            new EventEnt({...input,
            organizer: user,
            when: new Date(input.when)}
            )
        )
    }

    public async updateEvent(input:UpdateEventDTO, event:EventEnt): Promise<EventEnt>{
        
        return await this.eventsRepository.save( 
            new EventEnt({...event,
            ...input,
            when: input.when ?  new Date(input.when) : event.when})
          );
    }

    public async deleteEvent(id:number): Promise<DeleteResult>{
        
        return await this.eventsRepository.createQueryBuilder('e')
            .delete().where('id = :id', {id}).execute();
    }
    public async getEventsOrganizedByUserIdPaginated(userid:number, paginatedOptions: paginateOptions)
        :Promise<paginatedEvents>{
        
        return await paginate<EventEnt>(
            this.getEventsOrganizedByUserIdQuery(userid),
            paginatedOptions
        )
    }

    private getEventsOrganizedByUserIdQuery(userId:number):SelectQueryBuilder<EventEnt>{
        //console.log(userId);
        
        return this.getEventsBasedQuery()
            .where('e.organizerId = :userId', {userId});
    }

    public async getEventsAttendedByUserIdPaginated(userid:number, paginatedOptions: paginateOptions)
        :Promise<paginatedEvents>{
        
        return await paginate<EventEnt>(
            this.getEventsAttendedByUserIdQuery(userid),
            paginatedOptions
        )
    }

    private getEventsAttendedByUserIdQuery(userid:number):SelectQueryBuilder<EventEnt>{
        
        return this.getEventsBasedQuery()
            .leftJoinAndSelect('e.attendees','a')
            .where('a.userId = :userId', {userid});
    }
}

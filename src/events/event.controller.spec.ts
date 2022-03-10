import { User } from "./../auth/user.entity";
import { Repository } from "typeorm";
import { EventController } from "./event.controller";
import { EventEnt } from "./event.entity";
import { EventService } from "./event.service";
import { ListEvents } from "./input/list.events";
import { NotFoundException } from "@nestjs/common";

describe('EventController', () => {
    let eventController:EventController;
    let eventService:EventService;
    let eventsRepository:Repository<EventEnt>;
    // beforeAll(() => console.log("logged 1nce before"))
    beforeEach(() => {
        eventService = new EventService(eventsRepository);
        eventController = new EventController(eventService);
    })
    it('should return list of events', async () => {
        const result = {
            first: 1,
            last: 1,
            limit: 1,
            data: [],
        };
        eventService.getEventsWithAttendeeCountFilteredPaginated 
            = jest.fn().mockImplementation((): any => result);

        const spy = jest.spyOn(eventService, 'getEventsWithAttendeeCountFilteredPaginated')
            .mockImplementation((): any => result);
        expect(await eventController.findAll(new ListEvents))
            .toEqual(result);
        expect(spy).toBeCalledTimes(1);
    })

    it('should delete events when not around', async () => {
        
        const deleteSpy = jest.spyOn(eventService, 'deleteEvent');
        const findSpy = jest.spyOn(eventService, 'findOne')
            .mockImplementation((): any => undefined);

        try{
            await eventController.remove(1,new User())
        }catch(error){
            expect(error).toBeInstanceOf(NotFoundException);
        }
        expect(deleteSpy).toBeCalledTimes(0);
        expect(findSpy).toBeCalledTimes(1);
    })

    
})

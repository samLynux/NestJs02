import { User } from "./../auth/user.entity";
import { createQueryBuilder, Repository } from "typeorm";
import { EventEnt } from "./event.entity";
import { EventService } from "./event.service";
import { ListEvents } from "./input/list.events";
import { NotFoundException } from "@nestjs/common";
import {Test} from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('EventService', () => {
    let service:EventService;
    let repository:Repository<EventEnt>;
    let selectQB;
    let deleteQB;

    beforeEach(async () => {
        deleteQB = {
            where: jest.fn(),
            execute: jest.fn(),
        }

        
        selectQB = {
            delete: jest.fn().mockReturnValue(deleteQB),
            where: jest.fn(),
            execute: jest.fn(),
            orderBy: jest.fn(),
            leftJoinAndSelect: jest.fn(),
        }


        const module = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: getRepositoryToken(EventEnt),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(selectQB),
                        delete: jest.fn(),
                        where: jest.fn(),
                        execute: jest.fn(),
                    }
                }
            ]
        }).compile();

        service = module.get<EventService>(EventService);
        repository = module.get<Repository<EventEnt>>(getRepositoryToken(EventEnt));

        

        
    })

    describe('updateEvent',  () => {
        it('should update', async() => {
            const repoSpy = jest.spyOn(repository, 'save')
                .mockResolvedValue({id:1} as EventEnt);
            expect(service.updateEvent( {
                name: 'new name',
            },new EventEnt({id:1}))).resolves.toEqual({id:1});

            expect(repoSpy).toBeCalledWith( {id:1, name: 'new name'});

        })
    })

    describe('deleteEvent',  () => {
        it('should delete', async() => {
            const createQbSpy = jest.spyOn(repository, 'createQueryBuilder');
            const deleteSpy = jest.spyOn(selectQB, 'delete');
            const whereSpy = jest.spyOn(deleteQB, 'where').mockReturnValue(deleteQB);
            const executeSpy = jest.spyOn(deleteQB, 'execute');
            expect(service.deleteEvent(1)).resolves.toBe(undefined);

            expect(createQbSpy).toBeCalledTimes(1);
            expect(createQbSpy).toBeCalledWith('e');

            expect(deleteSpy).toBeCalledTimes(1);
            expect(whereSpy).toBeCalledTimes(1);
            expect(whereSpy).toBeCalledWith('id = :id', {id:1});
            expect(executeSpy).toBeCalledTimes(1);
        })
    })
    
})

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

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: getRepositoryToken(EventEnt),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn(),
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

    describe('updateEvent', async () => {
        it('should update', () => {
            const repoSpy = jest.spyOn(repository, 'save')
                .mockResolvedValue({id:1} as EventEnt);
            expect(service.updateEvent( {
                name: 'new name',
            },new EventEnt({id:1}))).resolves.toEqual({id:1});

            expect(repoSpy).toBeCalledWith( {id:1, name: 'new name'});

        })
    })
    
})

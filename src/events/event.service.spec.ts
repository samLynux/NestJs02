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
    it('should return list of events', async () => {
        
    })
    
})

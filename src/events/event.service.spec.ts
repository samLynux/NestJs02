import { EventEnt } from "./event.entity";
import { EventService } from "./event.service";
import {Test} from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as paginator from "./../pagination/paginator"
import { Repository } from "typeorm";

jest.mock('./../pagination/paginator');

describe('EventService', () => {
    let service:EventService;
    let repository:Repository<EventEnt>;
    let selectQB;
    let deleteQB;
    let mockedPaginate;

    beforeEach(async () => {
        mockedPaginate = paginator.paginate as jest.Mock;
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
        });
    });

    describe('getEventsAttendedByUserIdPaginated',  () => {
        it('should return events paginated', async() => {
            const orderBySpy = jest.spyOn(selectQB, 'orderBy').mockReturnValue(selectQB);
            const leftJoinSpy = jest.spyOn(selectQB, 'leftJoinAndSelect').mockReturnValue(selectQB);
            const whereSpy = jest.spyOn(selectQB, 'where').mockReturnValue(selectQB);

            mockedPaginate.mockResolvedValue({
                first:1,
                last:1,
                total:10,
                limit:10,
                data: []
            })

            expect(service.getEventsAttendedByUserIdPaginated(
                500,
                {limit:1, currentPage:1}
            )).resolves.toEqual({
                first:1,
                last:1,
                total:10,
                limit:10,
                data: []
            });

            expect(orderBySpy).toBeCalledTimes(1);
            expect(orderBySpy).toBeCalledWith('e.id', 'DESC');

            expect(leftJoinSpy).toBeCalledTimes(1);
            expect(leftJoinSpy).toBeCalledWith('e.attendees', 'a');

            expect(whereSpy).toBeCalledTimes(1);
            expect(whereSpy).toBeCalledWith('a.userId = :userId', {userid:500});

            expect(mockedPaginate).toBeCalledTimes(1);
            expect(mockedPaginate).toBeCalledWith(
                selectQB,
                {
                    currentPage:1, limit:1
                }
            );
        });
    });
    
})

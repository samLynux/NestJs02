import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Attendee } from "./attendee.entity";

@Injectable()
export class AttendeeService{
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository:Repository<Attendee>
    ){}


    public async findByEventId(eventId:number): Promise<Attendee[]> {
        return this.attendeeRepository.find({
            event: {id:eventId}
        })
    }

}
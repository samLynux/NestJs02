import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEnt } from "./event.entity";

export enum AttendeeAnswerEnum{
    accepted = 1,
    maybe,
    rejected
}

@Entity('attendees')
export class Attendee{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @ManyToOne(() => EventEnt, (event) => event.attendees,{
        nullable: false
    })
    @JoinColumn()
    event: EventEnt;


    @Column('enum', {
        enum: AttendeeAnswerEnum,
        default: AttendeeAnswerEnum.accepted
    })
    answer:AttendeeAnswerEnum;
}
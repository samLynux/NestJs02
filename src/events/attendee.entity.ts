import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
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
    @Expose()
    id: number;

    @Column()
    @Expose()
    name:string;

    @ManyToOne(() => EventEnt, (event) => event.attendees,{
        nullable: false
    })
    @JoinColumn()
    event: EventEnt;

    @Column()
    eventId:number;

    @Column('enum', {
        enum: AttendeeAnswerEnum,
        default: AttendeeAnswerEnum.accepted
    })
    @Expose()
    answer:AttendeeAnswerEnum;

    @ManyToOne(() => User, (user) => user.attended)
    user:User;

    @Column()
    userId:number;
}
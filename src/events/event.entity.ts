import { Expose } from "class-transformer";
import { User } from "./../auth/user.entity";
import { paginationResult } from "./../pagination/paginator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity('events')
export class EventEnt{
    constructor(
        partial?: Partial<EventEnt>
    ){
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name:string;

    @Column()
    @Expose()
    description:string;

    @Column()
    @Expose()
    when:Date;

    @Column()
    @Expose()
    address:string;

    @OneToMany(() => Attendee,(attendee) => attendee.event,{
        cascade: true
    })
    @Expose()
    attendees: Attendee[];

    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn({name: 'organizerId'})
    @Expose()
    organizer: User;

    @Column({nullable: true})
    organizerId:number;

    @Expose()
    attendeeCount?:number

    @Expose()
    attendeeRejected?:number;
    @Expose()
    attendeeMaybe?:number;
    @Expose()
    attendeeAccepted?:number;
}

export type paginatedEvents = paginationResult<EventEnt>;
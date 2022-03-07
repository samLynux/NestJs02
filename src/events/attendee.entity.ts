import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEnt } from "./event.entity";

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
}
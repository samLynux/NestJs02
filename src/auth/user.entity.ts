import { Expose } from "class-transformer";
import { Attendee } from "./../events/attendee.entity";
import { EventEnt } from "./../events/event.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({unique:true})
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({unique:true})
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => EventEnt, (event) => event.organizer)
  @Expose()
  organized: EventEnt[]

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended:Attendee[]
}
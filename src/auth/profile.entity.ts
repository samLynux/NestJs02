import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  age: number;



//   @ManyToMany(() => Subject, (subject) => subject.teachers)
//   subjects: Subject[];
}
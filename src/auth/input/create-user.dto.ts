import { IsEmail, Length } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class CreateUserDTO {
  @Length(5)
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  reTypedPassword: string;

  @IsEmail()
  email: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

}
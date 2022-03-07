import { IsDateString, IsString, Length } from "class-validator";

export class CreateEventDTO{
    @IsString()
    @Length(5,255, {message: "the length not right"})
    name:string;

    @Length(5,255)
    description:string;

    @IsDateString()
    when:string;

    @Length(5,255)
    address:string;
}
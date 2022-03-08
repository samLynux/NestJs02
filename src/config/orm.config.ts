import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Profile } from "src/auth/profile.entity";
import { User } from "src/auth/user.entity";
import { Attendee } from "src/events/attendee.entity";
import { EventEnt } from "src/events/event.entity";
import { Subject } from "src/school/subject.entity";
import { Teacher } from "src/school/teacher.entity";

export default registerAs('orm.config', ():TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
      EventEnt,
      Attendee,
      Subject,
      Teacher, 
      Profile,
      User
    ],
    synchronize: true,
  }))
import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { CreateUserDTO } from "./input/create-user.dto";
import { User } from "./user.entity";

@Controller('users')
export class UserController{
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}
    
    @Post('')
    async create(@Body() createUserDTO:CreateUserDTO){
        const user = new User();

        if(createUserDTO.password !== createUserDTO.reTypedPassword){
            throw new BadRequestException(["password not same"]);
        }

        const existingUser = await this.userRepository.findOne({
            where: [
                {username: createUserDTO.username},
                {email: createUserDTO.email},
            ]
        })

        if(existingUser){
            throw new BadRequestException(["username/ email taken"]);
        }


        user.username = createUserDTO.username;
        user.password = await this.authService.HashPassword(createUserDTO.password);
        user.email = createUserDTO.email;
        user.firstName = createUserDTO.firstName;
        user.lastName = createUserDTO.lastName;

        return {
            ...(await this.userRepository.save(user)),
            token: this.authService.GetTokenUser(user)
        }
    }

 
}
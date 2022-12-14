import { Controller, Get, NotFoundException, Param, ParseIntPipe, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UsersService } from './users.service'; 

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Get()
    async list(@Req() request: Request): Promise<User[]>  {
        console.log(request.user);
        return this.usersService.list({});
    }

    @Get(':id')
    async get(@Req() request: Request, @Param('id', ParseIntPipe) id: number): Promise<User | null> {
        const user = await this.usersService.get({
            id: id
        });
        if (user === null) throw new NotFoundException();
        return user;
    }
}

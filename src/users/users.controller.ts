import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service'; 

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Get()
    async list(@Req() request: Request): Promise<User[]>  {
        return this.usersService.users({});
    }

    @Get(':id')
    async get(@Req() request: Request, @Param() params): Promise<User | null> {
        const user = await this.usersService.user({
            id: parseInt(params.id)
        });
        if (user === null) throw new NotFoundException();
        return user;
    }
}

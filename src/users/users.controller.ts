import { Controller, Get, NotFoundException, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { UserExists } from './userExists.guard';
import { UsersService } from './users.service'; 

@Controller('api/users')
@UseGuards(SessionAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Get()
    async list(@Req() request: Request)  {
        return this.usersService.list();
    }

    @Get(':id')
    async get(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.get({
            id: id
        });
        if (user === null) throw new NotFoundException();
        return user;
    }

    @Get(':id/projects')
    @UseGuards(UserExists)
    async projects(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getProjects(id);
    }

    @Get(':id/posts')
    @UseGuards(UserExists)
    async posts(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getPosts(id);
    }
}

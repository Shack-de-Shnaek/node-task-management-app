import { Body, Controller, Get, Post, Redirect, Req, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/user-create.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuth.guard';
import { SessionAuthGuard } from './sessionAuth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }
    
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() request: Request) {
        return request.user;
    }

    @Post('register')
    async register(@Body(new ValidationPipe()) data: CreateUserDto) {
        data.password = await hash(data.password, 10);
        const { password, ...user } = await this.usersService.create(data);
        return user
    }

    @Post('logout')
    @UseGuards(SessionAuthGuard)
    async logout(@Req() request: Request) {
        request.session.destroy(() => {});
        return Redirect('/login');
    }

    @Get('test')
    @UseGuards(SessionAuthGuard)
    async test(@Req() request: Request) {
        return request.user;
    }
}

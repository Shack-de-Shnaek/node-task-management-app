import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Request, Response } from 'express';
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
    @HttpCode(201)
    async register(@Body(new ValidationPipe()) data: CreateUserDto) {
        data.password = await hash(data.password, 10);
        const { password, ...user } = await this.usersService.create(data);
        return user
    }

    @Post('logout')
    @HttpCode(303)
    @UseGuards(SessionAuthGuard)
    async logout(@Req() request: Request, @Res() response: Response) {
        request.session.destroy(() => {});
        response.redirect('/login');
    }

    @Get('test')
    @UseGuards(SessionAuthGuard)
    async test(@Req() request: Request) {
        return request.user;
    }
}

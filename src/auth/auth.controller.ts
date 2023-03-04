import {
	Body,
	Controller,
	Get,
	Header,
	HttpCode,
	NotFoundException,
	Post,
	Req,
	Res,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/user-create.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuth.guard';

@Controller('auth')
export class AuthController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@Header('Content-Type', 'application/json')
	async login(@Req() request: Request) {
		return request.user;
	}

	@Post('register')
	@HttpCode(201)
	@Header('Content-Type', 'application/json')
	async register(@Body(new ValidationPipe()) data: CreateUserDto, @Res() response: Response) {
		await this.authService.registerUser(data);
		response.status(201).send();
	}

	@Post('logout')
	@HttpCode(303)
	@Header('Content-Type', 'application/json')
	async logout(@Req() request: Request, @Res() response: Response) {
		request.session.destroy(() => {});
		response.redirect('/login');
	}

	@Get('current-user')
	@HttpCode(200)
	@Header('Content-Type', 'application/json')
	async currentUser(@Req() request) {
		if (request.user) {
			const user = await this.usersService.get({ id: request.user.id }, false, true, null);
			return user;
		}
		throw new NotFoundException('You are not logged in');
	}
}

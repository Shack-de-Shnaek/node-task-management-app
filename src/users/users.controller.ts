import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Req,
	UseGuards,
	HttpCode,
	ValidationPipe,
	Body,
	Put,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { UpdateUserDto } from './user-update.dto';
import { UserExists } from './userExists.guard';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(SessionAuthGuard)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Put()
	@HttpCode(200)
	async updateCurrentUser(@Body(new ValidationPipe()) data: UpdateUserDto, @Req() request) {
		return this.usersService.update(request.user.id, data);
	}

	@Get('posts')
	@HttpCode(200)
	async posts(@Req() request) {
		return this.usersService.getPosts(request.user.id);
	}

	@Get('tasks')
	async tasks(@Req() request) {
		return this.usersService.getTasks(request.user.id);
	}

	@Get(':userId')
	@HttpCode(200)
	async get(@Req() request, @Param('userId', ParseIntPipe, new ValidationPipe()) userId: number) {
		const isSameUser = userId === request.user.id;
		return this.usersService.get(
			{ id: userId },
			false,
			true,
			isSameUser ? null : request.user.id,
		);
	}

	// @Get(':id/projects')
	// @HttpCode(200)
	// @UseGuards(UserExists)
	// async projects(@Param('id', ParseIntPipe, new ValidationPipe()) id: number) {
	// 	return this.usersService.getProjects(id);
	// }
}

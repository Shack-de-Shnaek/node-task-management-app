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

	@Get()
	@HttpCode(200)
	async list(@Req() request: Request) {
		return this.usersService.list();
	}

	@Put()
	@HttpCode(200)
	async updateCurrentUser(@Body(new ValidationPipe()) data: UpdateUserDto, @Req() request) {
		return this.usersService.update(request.user.id, data);
	}

	@Get(':id')
	@HttpCode(200)
	async get(
		@Req() request: Request,
		@Param('id', ParseIntPipe, new ValidationPipe()) id: number,
	) {
		const user = await this.usersService.get({
			id: id,
		});
		if (user === null) throw new NotFoundException();
		return user;
	}

	@Get(':id/projects')
	@HttpCode(200)
	@UseGuards(UserExists)
	async projects(@Param('id', ParseIntPipe, new ValidationPipe()) id: number) {
		return this.usersService.getProjects(id);
	}

	@Get(':id/posts')
	@HttpCode(200)
	@UseGuards(UserExists)
	async posts(@Param('id', ParseIntPipe, new ValidationPipe()) id: number) {
		return this.usersService.getPosts(id);
	}
}

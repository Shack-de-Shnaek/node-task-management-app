import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from 'src/users/user-create.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.get({ email: email }, true, false);
		if (user === null) throw new NotFoundException('This account does not exist');
		const passwordIsCorrect = await compare(password, user.password);
		if (!passwordIsCorrect) throw new UnauthorizedException('Incorrect password');
		delete user.password;
		return user;
	}

	async registerUser(data: CreateUserDto) {
		data.password = await hash(data.password, 10);
		const user = await this.usersService.get({ email: data.email }, false, false, null);
		if (user !== null) {
			throw new BadRequestException('An account with this email address already exists');
		}
		await this.usersService.create(data);
	}
}

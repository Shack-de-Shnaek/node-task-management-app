import { ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
	constructor(private usersService: UsersService) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const result = (await super.canActivate(context)) as boolean;
		const request: Request = context.switchToHttp().getRequest();
		const user = await this.usersService.get({ email: request.body.email }, false);
		if (user === null) throw new NotFoundException('This account does not exist');
		await super.logIn(request);
		return result;
	}
}

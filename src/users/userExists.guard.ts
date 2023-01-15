import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { NotFoundError, Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class UserExists implements CanActivate {
	constructor(private userService: UsersService) {}

	async canActivate(context: ExecutionContext) {
		const request: Request = context.switchToHttp().getRequest();
		if (
			(await this.userService.get({
				id: parseInt(request.params.id),
			})) !== null
		)
			return true;
		else throw new NotFoundException();
	}
}

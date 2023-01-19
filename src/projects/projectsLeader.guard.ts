import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectLeaderGuard implements CanActivate {
	constructor(private projectsService: ProjectsService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const project = await this.projectsService.get(
			{
				id: parseInt(request.params.projectId),
			},
			false,
		);
		if (project === null) throw new NotFoundException('Project does not exist');

		if (project.leader.id === request.user.id) return true;
		throw new ForbiddenException();
	}
}

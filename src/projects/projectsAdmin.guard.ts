import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
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

		if (project.admins.find((admin) => admin.id === request.user.id) !== undefined) return true;
		throw new ForbiddenException();
	}
}

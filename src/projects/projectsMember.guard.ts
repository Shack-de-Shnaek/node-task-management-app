import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
	constructor(private projectsService: ProjectsService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const project = await this.projectsService.get({
			id: parseInt(request.params.id),
		});
		if (project === null) throw new NotFoundException('Project does not exist');

		if (project.members.find((member) => member.id === request.user.id) !== undefined)
			return true;
		throw new ForbiddenException();
	}
}

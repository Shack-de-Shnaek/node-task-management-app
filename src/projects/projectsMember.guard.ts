import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
	constructor(
		private projectsService: ProjectsService,
		@Inject(forwardRef(() => TasksService)) private tasksService: TasksService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		let project = null;

		if (context.getClass().name === 'TasksController') {
			const task = await this.tasksService.get(
				{
					id: parseInt(request.params.taskId),
				},
				false,
			);
			if (task === null) throw new NotFoundException('Task does not exist');
			project = await this.projectsService.get(
				{
					id: task.project.id,
				},
				false,
			);
		} else {
			project = await this.projectsService.get(
				{
					id: parseInt(request.params.projectId),
				},
				false,
			);
		}

		if (project === null) throw new NotFoundException('Project does not exist');

		if (project.members.find((member) => member.id === request.user.id) !== undefined)
			return true;
		throw new ForbiddenException();
	}
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { TasksService } from './tasks.service';

@Controller('api/tasks')
@UseGuards(SessionAuthGuard)
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get('severities-priorities-statuses')
	async getSeveritiesPrioritiesStatuses() {
		return this.tasksService.getTaskSeveritiesPrioritiesStatuses();
	}
}

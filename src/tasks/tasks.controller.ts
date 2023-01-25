import {
	Body,
	Controller,
	forwardRef,
	Get,
	Inject,
	Param,
	ParseIntPipe,
	Put,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { ProjectMemberGuard } from 'src/projects/projectsMember.guard';
import { UpdateTaskDto } from './task-update.dto';
import { TasksService } from './tasks.service';

@Controller('api/tasks')
@UseGuards(SessionAuthGuard)
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get('severities-priorities-statuses')
	async getSeveritiesPrioritiesStatuses() {
		return this.tasksService.getTaskSeveritiesPrioritiesStatuses();
	}

	@Get(':taskId')
	@UseGuards(ProjectMemberGuard)
	async getTask(@Param('taskId', ParseIntPipe) taskId: number) {
		return this.tasksService.get({ id: taskId });
	}

	@Put(':taskId')
	@UseGuards(ProjectMemberGuard)
	async updateTask(@Param('taskId', ParseIntPipe) taskId: number, @Body(new ValidationPipe()) data: UpdateTaskDto) {
		return this.tasksService.update(taskId, data);
	}
}

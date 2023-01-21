import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { ProjectMemberGuard } from 'src/projects/projectsMember.guard';
import { CreateTaskDto } from './task-create.dto';
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

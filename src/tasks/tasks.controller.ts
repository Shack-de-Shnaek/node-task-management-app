import {
	Body,
	Controller,
	forwardRef,
	Get,
	HttpCode,
	Inject,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { ProjectMemberGuard } from 'src/projects/projectsMember.guard';
import { UpdateTaskDto } from './task-update.dto';
import { CreateTaskCommentDto } from './taskComment-create.dto';
import { TaskExistsPipe } from './taskExists.pipe';
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
	async getTask(@Param('taskId', ParseIntPipe, TaskExistsPipe) taskId: number) {
		return this.tasksService.get({ id: taskId });
	}

	@Put(':taskId')
	@UseGuards(ProjectMemberGuard)
	async updateTask(
		@Param('taskId', ParseIntPipe, TaskExistsPipe) taskId: number,
		@Body(new ValidationPipe()) data: UpdateTaskDto,
	) {
		return this.tasksService.update(taskId, data);
	}

	@Post(':taskId/comments')
	@HttpCode(201)
	@UseGuards(ProjectMemberGuard)
	async addComment(
		@Param('taskId', ParseIntPipe, TaskExistsPipe) taskId: number,
		@Body(new ValidationPipe()) data: CreateTaskCommentDto,
		@Req() request,
	) {
		return this.tasksService.createComment(taskId, request.user.id, data);
	}
}

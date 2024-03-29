import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Req,
	UseGuards,
	ValidationPipe,
	HttpCode,
	Delete,
	Put,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { CreatePostDto } from 'src/posts/post-create.dto';
import { CreateTaskDto } from 'src/tasks/task-create.dto';
import { CreateTaskCategoryDto } from 'src/tasks/taskCategory-create.dto';
import { UserEmail } from 'src/users/user-email.dto';
import { CreateProjectDto } from './project-create.dto';
import { UpdateProjectDto } from './project-update.dto';
import { ProjectsService } from './projects.service';
import { ProjectAdminGuard } from './projectsAdmin.guard';
import { ProjectLeaderGuard } from './projectsLeader.guard';
import { ProjectMemberGuard } from './projectsMember.guard';
import { ProjectExistsPipe } from './projectExists.pipe';
import { UserExistsPipe } from 'src/users/userExists.pipe';
import { TaskExistsPipe } from 'src/tasks/taskExists.pipe';

@Controller('api/projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
	constructor(private projectsService: ProjectsService) {}

	@Get(':projectId')
	@UseGuards(ProjectMemberGuard)
	async get(@Param('projectId', ParseIntPipe) projectId: number) {
		return this.projectsService.get({ id: projectId });
	}

	@Post()
	@HttpCode(201)
	async create(@Body(new ValidationPipe()) body: CreateProjectDto, @Req() request) {
		const leaderId: number = request.user.id;
		const data = {
			...body,
			leaderId: leaderId,
		};
		return this.projectsService.create(request.user.id, data);
	}

	@Put(':projectId')
	@UseGuards(ProjectAdminGuard)
	async update(
		@Body(new ValidationPipe()) data: UpdateProjectDto,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) id: number,
	) {
		return this.projectsService.update(id, data);
	}

	@Post(':projectId/members')
	@HttpCode(200)
	@UseGuards(ProjectAdminGuard)
	async addMember(
		@Body(new ValidationPipe()) email: UserEmail,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
	) {
		return this.projectsService.addMember(projectId, email.email);
	}

	@Post(':projectId/admins')
	@HttpCode(200)
	@UseGuards(ProjectLeaderGuard)
	async addAdmin(
		@Body('userId', new ValidationPipe(), UserExistsPipe) userId: number,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
	) {
		return this.projectsService.addAdmin(projectId, userId);
	}

	@Delete(':projectId/members')
	@HttpCode(200)
	@UseGuards(ProjectAdminGuard)
	async removeMember(
		@Body('userId', new ValidationPipe(), UserExistsPipe) userId: number,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
	) {
		return this.projectsService.removeMember(projectId, userId);
	}

	@Delete(':projectId/members/self')
	@HttpCode(200)
	@UseGuards(ProjectMemberGuard)
	async removeMemberSelf(
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
		@Req() request,
	) {
		return this.projectsService.removeMember(projectId, request.user.id);
	}

	@Delete(':projectId/admins')
	@HttpCode(200)
	@UseGuards(ProjectLeaderGuard)
	async removeAdmin(
		@Body('userId', new ValidationPipe(), UserExistsPipe) userId: number,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
	) {
		return this.projectsService.removeAdmin(projectId, userId);
	}

	@Get(':projectId/posts')
	@UseGuards(ProjectMemberGuard)
	async getPosts(@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number) {
		return this.projectsService.getPosts(projectId);
	}

	@Post(':projectId/posts')
	@HttpCode(201)
	@UseGuards(ProjectMemberGuard)
	async addPost(
		@Body(new ValidationPipe()) data: CreatePostDto,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
		@Req() request,
	) {
		return this.projectsService.addPost(projectId, request.user.id, data);
	}

	@Post(':projectId/posts/:postId/comments')
	@HttpCode(201)
	@UseGuards(ProjectMemberGuard)
	async addComment(
		@Body('content', new ValidationPipe()) content: string,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
		@Param('postId', ParseIntPipe) postId: number,
		@Req() request,
	) {
		return this.projectsService.addPostComment(projectId, request.user.id, postId, content);
	}

	@Post(':projectId/task-categories')
	@HttpCode(201)
	@UseGuards(ProjectAdminGuard)
	async addTaskCategory(
		@Body(new ValidationPipe()) data: CreateTaskCategoryDto,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
	) {
		return this.projectsService.addTaskCategory(projectId, data);
	}

	@Delete(':projectId/task-categories/:taskCategoryId')
	@HttpCode(200)
	@UseGuards(ProjectAdminGuard)
	async removeTaskCategory(
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
		@Param('taskCategoryId', ParseIntPipe) taskCategoryId: number,
	) {
		return this.projectsService.removeTaskCategory(projectId, taskCategoryId);
	}

	@Get(':projectId/tasks')
	@UseGuards(ProjectMemberGuard)
	async getTasks(@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number) {
		return this.projectsService.getTasks(projectId);
	}

	@Post(':projectId/tasks')
	@HttpCode(201)
	@UseGuards(ProjectMemberGuard)
	async addTask(
		@Body(new ValidationPipe()) data: CreateTaskDto,
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
		@Req() request,
	) {
		return this.projectsService.addTask(projectId, request.user.id, data);
	}

	@Delete(':projectId/tasks/:taskId')
	@HttpCode(200)
	@UseGuards(ProjectMemberGuard)
	async removeTask(
		@Param('projectId', ParseIntPipe, ProjectExistsPipe) projectId: number,
		@Param('taskId', ParseIntPipe, TaskExistsPipe) taskId: number,
	) {
		return this.projectsService.removeTask(projectId, taskId);
	}
}

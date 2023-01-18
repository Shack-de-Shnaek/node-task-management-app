import {
	Body,
	Controller,
	Get,
	NotFoundException,
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
import { PostsService } from 'src/posts/posts.service';
import { UserEmail } from 'src/users/user-email.dto';
import { CreateProjectDto } from './project-create.dto';
import { UpdateProjectDto } from './project-update.dto';
import { ProjectsService } from './projects.service';
import { ProjectAdminGuard } from './projectsAdmin.guard';
import { ProjectLeaderGuard } from './projectsLeader.guard';
import { ProjectMemberGuard } from './projectsMember.guard';

@Controller('api/projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
	constructor(private projectsService: ProjectsService) {}

	@Get()
	@HttpCode(200)
	async list() {
		return this.projectsService.list();
	}

	@Get(':projectId')
	@HttpCode(200)
	async get(@Param('projectId', ParseIntPipe) projectId: number) {
		return this.projectsService.get({ id: projectId })
	}

	@Post()
	@HttpCode(201)
	async create(@Body(new ValidationPipe()) body: CreateProjectDto, @Req() request) {
		const leaderId: number = request.user.id;
		const data = {
			...body,
			leaderId: leaderId,
		};
		return this.projectsService.create(data);
	}

	@Put(':projectId')
	@HttpCode(200)
	@UseGuards(ProjectAdminGuard)
	async update(
		@Body(new ValidationPipe()) data: UpdateProjectDto,
		@Param('projectId', ParseIntPipe) id: number,
	) {
		return this.projectsService.update(id, data);
	}

	@Post(':projectId/members')
	@HttpCode(200)
	@UseGuards(ProjectAdminGuard)
	async addMember(
		@Body(new ValidationPipe()) email: UserEmail,
		@Param('projectId', ParseIntPipe) projectId: number,
	) {
		console.log('add member route')
		return this.projectsService.addMember(projectId, email.email);
	}

	@Post(':projectId/admins')
	@HttpCode(200)
	@UseGuards(ProjectLeaderGuard)
	async addAdmin(
		@Body('userId', new ValidationPipe()) userId: number,
		@Param('projectId', ParseIntPipe) projectId: number,
	) {
		return this.projectsService.addAdmin(projectId, userId);
	}

	@Delete(':projectId/members')
	@HttpCode(200)
	@UseGuards(ProjectAdminGuard)
	async removeMember(
		@Body('userId', new ValidationPipe()) userId: number,
		@Param('projectId', ParseIntPipe) projectId: number,
	) {
		return this.projectsService.removeMember(projectId, userId);
	}

	@Delete(':projectId/admins')
	@HttpCode(200)
	@UseGuards(ProjectLeaderGuard)
	async removeAdmin(
		@Body('userId', new ValidationPipe()) userId: number,
		@Param('projectId', ParseIntPipe) projectId: number,
	) {
		return this.projectsService.removeAdmin(projectId, userId);
	}

	@Post(':projectId/posts')
	@HttpCode(201)
	@UseGuards(ProjectMemberGuard)
	async addPost(
		@Body(new ValidationPipe()) data: CreatePostDto,
		@Param('projectId', ParseIntPipe) projectId: number,
		@Req() request,
	) {
		return this.projectsService.addPost(projectId, request.user.id, data);
	}

	@Post(':projectId/posts/:postId/comments')
	@HttpCode(201)
	@UseGuards(ProjectMemberGuard)
	async addComment(
		@Body('content', new ValidationPipe()) content: string,
		@Param('projectId', ParseIntPipe) projectId: number,
		@Param('postId', ParseIntPipe) postId: number,
		@Req() request,
	) {
		return this.projectsService.addPostComment(projectId, request.user.id, postId, content);
	}
}
import {
	BadRequestException,
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { postSelector } from 'prisma/selectors/postSelectors';
import { projectLimitedSelector, projectSelector } from 'prisma/selectors/projectSelectors';
import { taskSelector } from 'prisma/selectors/taskSelectors';
import { FilesService } from 'src/files/files.service';
import { CreatePostDto } from 'src/posts/post-create.dto';
import { PostsService } from 'src/posts/posts.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from 'src/tasks/task-create.dto';
import { CreateTaskCategoryDto } from 'src/tasks/taskCategory-create.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateProjectDto } from './project-create.dto';
import { UpdateProjectDto } from './project-update.dto';

@Injectable()
export class ProjectsService {
	constructor(
		private prisma: PrismaService,
		private filesService: FilesService,
		private postsService: PostsService,
		@Inject(forwardRef(() => TasksService)) private tasksService: TasksService,
	) {}

	async get(projectWhereUniqueImport: Prisma.ProjectWhereUniqueInput, raiseException = true) {
		if (raiseException) {
			return this.prisma.project.findUniqueOrThrow({
				select: projectSelector.select,
				where: projectWhereUniqueImport,
			});
		}
		return this.prisma.project.findUnique({
			select: projectSelector.select,
			where: projectWhereUniqueImport,
		});
	}

	async list(params?: {
		skip?: number;
		take?: number;
		cursor?: Prisma.ProjectWhereUniqueInput;
		where?: Prisma.ProjectWhereInput;
		orderBy?: Prisma.ProjectOrderByWithRelationInput;
	}) {
		return this.prisma.project.findMany({
			...projectLimitedSelector,
			...params,
		});
	}

	async create(leaderId: number, data: CreateProjectDto) {
		let thumbnailPath: string;
		if (data.thumbnail) {
			thumbnailPath = await this.filesService.generateThumbnailFile(data.thumbnail);
		}

		return this.prisma.project.create({
			data: {
				name: data.name,
				description: data.description,
				...(thumbnailPath !== undefined ? { thumbnailPath: thumbnailPath } : {}),
				leader: {
					connect: {
						id: leaderId,
					},
				},
				members: {
					connect: {
						id: leaderId,
					},
				},
				admins: {
					connect: {
						id: leaderId,
					},
				},
			},
			select: projectSelector.select,
		});
	}

	async update(id: number, data: UpdateProjectDto) {
		let thumbnailPath: string = null;
		if (data.image) {
			thumbnailPath = await this.filesService.generateThumbnailFile(data.image);
			if (thumbnailPath !== null) delete data.image;
		}
		return this.prisma.project.update({
			where: { id: id },
			data: {
				...data,
				...(thumbnailPath ? { thumbnailPath: thumbnailPath } : {}),
			},
			select: projectSelector.select,
		});
	}

	async addMember(projectId: number, email: string) {
		return this.prisma.project.update({
			where: { id: projectId },
			data: {
				members: {
					connect: {
						email: email,
					},
				},
			},
			select: projectSelector.select,
		});
	}

	async removeMember(projectId: number, userId: number) {
		const project = await this.prisma.project.findUniqueOrThrow({
			where: { id: projectId },
			select: {
				leaderId: true,
				members: {
					select: {
						id: true,
					},
				},
			},
		});

		if (!project.members.flatMap((member) => member.id).includes(userId))
			throw new BadRequestException('User is not a member');
		if (project.leaderId === userId)
			throw new BadRequestException('Cannot remove the leader of the project');

		return this.prisma.project.update({
			where: { id: projectId },
			data: {
				members: {
					disconnect: {
						id: userId,
					},
				},
				admins: {
					disconnect: {
						id: userId,
					},
				},
			},
			select: projectSelector.select,
		});
	}

	async addAdmin(projectId: number, userId: number) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: {
				members: {
					select: {
						id: true,
					},
				},
			},
		});

		if (!project.members.flatMap((user) => user.id).includes(userId))
			throw new BadRequestException('User is not a member of this project');

		return this.prisma.project.update({
			where: { id: projectId },
			data: {
				admins: {
					connect: {
						id: userId,
					},
				},
			},
			select: projectSelector.select,
		});
	}

	async removeAdmin(projectId: number, userId: number) {
		const project = await this.prisma.project.findUniqueOrThrow({
			where: { id: projectId },
			select: {
				members: {
					select: {
						id: true,
					},
				},
				admins: {
					select: {
						id: true,
					},
				},
				leaderId: true,
			},
		});

		if (!project.members.flatMap((member) => member.id).includes(userId))
			throw new BadRequestException('User is not a member');
		if (!project.admins.flatMap((admin) => admin.id).includes(userId))
			throw new BadRequestException('User is not an admin');
		if (project.leaderId === userId)
			throw new ForbiddenException('Cannot remove the leader of the project');

		return this.prisma.project.update({
			where: { id: projectId },
			data: {
				admins: {
					disconnect: {
						id: userId,
					},
				},
			},
			select: projectSelector.select,
		});
	}

	async getPosts(projectId: number) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: { posts: postSelector },
		});

		return project.posts;
	}

	async addPost(projectId: number, authorId: number, data: CreatePostDto) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: { id: true },
		});

		await this.postsService.create(data, projectId, authorId);
		return this.get({ id: projectId }, false);
	}

	async addPostComment(projectId: number, authorId: number, postId: number, content: string) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: {
				id: true,
				posts: {
					select: {
						id: true,
					},
				},
			},
		});
		if (!project.posts.flatMap((post) => post.id).includes(postId))
			throw new NotFoundException('Post is not in this project');
		await this.postsService.createComment(postId, content, authorId);
		return this.prisma.project.findUnique({
			where: { id: projectId },
			select: projectSelector.select,
		});
	}

	async addTaskCategory(projectId: number, data: CreateTaskCategoryDto) {
		await this.tasksService.createTaskCategory(projectId, data);
		return this.get({ id: projectId });
	}

	async removeTaskCategory(projectId: number, taskCategoryId: number) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: {
				id: true,
				taskCategories: {
					select: { id: true },
				},
			},
		});

		if (!project.taskCategories.flatMap((category) => category.id).includes(taskCategoryId))
			throw new NotFoundException('Category is not in this project or does not exist');

		const taskCount = await this.prisma.task.aggregate({
			_count: true,
			where: { projectId: projectId, categoryId: taskCategoryId },
		});

		if (taskCount._count > 0)
			throw new BadRequestException(
				`You cannot delete that category because ${taskCount._count} task(s) are using it`,
			);

		return this.prisma.project.update({
			where: { id: projectId },
			select: projectSelector.select,
			data: {
				taskCategories: {
					delete: {
						id: taskCategoryId,
					},
				},
			},
		});
	}

	async getTasks(projectId: number) {
		return this.prisma.task.findMany({
			where: { projectId: projectId },
			select: taskSelector.select,
			orderBy: taskSelector.orderBy,
		});
	}

	async addTask(projectId: number, creatorId: number, data: CreateTaskDto) {
		await this.tasksService.create(data, projectId, creatorId);
		return this.get({ id: projectId });
	}

	async removeTask(projectId: number, taskId: number) {
		const project = await this.prisma.project.findUniqueOrThrow({
			where: { id: projectId },
			select: { id: true, tasks: { select: { id: true } } },
		});

		if (!project.tasks.flatMap((task) => task.id).includes(taskId))
			throw new NotFoundException('Task does not exist');

		await this.tasksService.deleteTask(taskId);

		return this.get({ id: projectId });
	}

	async delete(id: number) {
		return this.prisma.project.delete({
			where: { id: id },
			select: { id: true },
		});
	}
}

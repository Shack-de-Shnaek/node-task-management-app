import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { postSelector } from 'prisma/selectors/postSelectors';
import { projectLimitedSelector, projectSelector } from 'prisma/selectors/projectSelectors';
import { taskSelector } from 'prisma/selectors/taskSelectors';
import { userLimitedSelector, userSelector } from 'prisma/selectors/userSelectors';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './user-update.dto';

@Injectable()
export class UsersService implements ICrudService {
	constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async get(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
		getPassword = false,
		raiseException = true,
		mutualUserId: number = null,
	) {
		let select = {
			password: getPassword
		}
		if (mutualUserId === null) select = { ...select, ...userSelector.select }
		else {
			console.log('mutual')
			let mutualSelect: Prisma.UserSelect = Object(userSelector.select);
			
			const mutualProjectMemberFilter = {
				some: {
					id: mutualUserId
				}
			}
			
			mutualSelect.projects = mutualSelect.adminOfProjects = mutualSelect.leaderOfProjects = {
				where: {
					members: mutualProjectMemberFilter
				},
				...projectSelector
			}
			mutualSelect.assignedTasks = mutualSelect.createdTasks = {
				where: {
					project: {
						members: mutualProjectMemberFilter
					}
				},
				...taskSelector
			}
			mutualSelect.posts = {
				where: {
					project: {
						members: mutualProjectMemberFilter
					}
				},
				...postSelector
			}
			
			select = { ...select, ...mutualSelect }
		}
		
		if (raiseException) {
			return this.prisma.user.findUniqueOrThrow({
				where: userWhereUniqueInput,
				select: {
					...select,
					password: getPassword,
				},
			});
		}
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
			select: {
				...select,
				password: getPassword,
			},
		});
	}

	async list(params?: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}) {
		return this.prisma.user.findMany({
			...params,
			...userLimitedSelector,
		});
	}

	async create(data: Prisma.UserCreateInput) {
		return this.prisma.user.create({
			data: data,
		});
	}

	async update(id: number, data: UpdateUserDto) {
		let thumbnailPath: string = null;
		if (data.image) {
			thumbnailPath = await this.filesService.generateThumbnailFile(data.image);
			if (thumbnailPath !== null) delete data.image;
		}
		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				...data,
				...(thumbnailPath ? { thumbnailPath: thumbnailPath } : {}),
			},
			select: userSelector.select,
		});
	}

	async delete(id: number) {
		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				isActive: false,
				firstName: 'Deleted',
				lastName: 'User',
			},
		});
	}

	async getProjects(userId: number) {
		return this.prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				projects: {
					...projectLimitedSelector,
				},
				leaderOfProjects: {
					...projectLimitedSelector,
				},
				adminOfProjects: {
					...projectLimitedSelector,
				},
			},
		});
	}

	async getPosts(userId: number) {
		return this.prisma.post.findMany({
			where: {
				project: {
					members: {
						some: {
							id: userId,
						},
					},
				},
			},
			...postSelector,
		});
	}

	async getTasks(userId: number) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { id: userId },
			select: {
				projects: {
					select: {
						tasks: taskSelector,
					},
				},
			},
		});
		return user.projects.flatMap((project) => project.tasks);
	}
}

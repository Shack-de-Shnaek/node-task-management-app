import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { postSelector } from 'prisma/selectors/postSelectors';
import { projectLimitedSelector } from 'prisma/selectors/projectSelectors';
import { userLimitedSelector, userSelector } from 'prisma/selectors/userSelectors';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './user-update.dto';

@Injectable()
export class UsersService implements ICrudService {
	constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async get(userWhereUniqueInput: Prisma.UserWhereUniqueInput, getPassword = false) {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				password: getPassword,
				description: true,
				projects: {
					...projectLimitedSelector,
				},
				leaderOfProjects: {
					...projectLimitedSelector,
				},
				adminOfProjects: {
					...projectLimitedSelector,
				},
				posts: {
					...postSelector
				},
				createdTasks: {
					select: {
						id: true,
						title: true,
						description: true,
					},
					orderBy: {
						createdAt: 'desc'
					}
				},
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

	async getProjects(id: number) {
		return this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				projects: {
					...projectLimitedSelector,
				},
				leaderOfProjects: {
					...projectLimitedSelector,
				},
				adminOfProjects: {
					...projectLimitedSelector
				}
			},
		});
	}

	async getPosts(id: number) {
		return this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				posts: {
					...postSelector,
				},
			},
		});
	}
}

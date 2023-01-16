import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { projectLimitedSelector, projectSelector } from 'prisma/selectors/projectSelectors';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { UpdateProjectDto } from './project-update.dto';

@Injectable()
export class ProjectsService implements ICrudService {
	constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async get(projectWhereUniqueImport: Prisma.ProjectWhereUniqueInput) {
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

	async create(data: { leaderId: number; name: string; description: string }) {
		return this.prisma.project.create({
			data: {
				name: data.name,
				description: data.description,
				leader: {
					connect: {
						id: data.leaderId,
					},
				},
				members: {
					connect: {
						id: data.leaderId,
					},
				},
				admins: {
					connect: {
						id: data.leaderId,
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
			where: {
				id: id,
			},
			data: {
				...data,
				...(thumbnailPath ? { thumbnailPath: thumbnailPath } : {}),
			},
			select: projectSelector.select,
		});
	}

	async addMember(projectId: number, email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email: email },
			select: {
				id: true,
			},
		});
		if (user === null) throw new NotFoundException('User does not exist');
		return this.prisma.project.update({
			where: {
				id: projectId,
			},
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
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
			},
		});
		const project = await this.prisma.project.findUnique({
			where: {
				id: projectId,
			},
			select: {
				leaderId: true,
				members: {
					select: {
						id: true,
					},
				},
			},
		});

		if (user === null) throw new NotFoundException('User does not exist');
		if (!project.members.flatMap((member) => member.id).includes(userId))
			throw new BadRequestException('User is not a member');
		if (project.leaderId === userId)
			throw new BadRequestException('Cannot remove the leader of the project');

		return this.prisma.project.update({
			where: {
				id: projectId,
			},
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
			where: {
				id: projectId,
			},
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
			where: {
				id: projectId,
			},
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
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
			},
		});
		const project = await this.prisma.project.findUnique({
			where: {
				id: projectId,
			},
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

		if (user === null) throw new NotFoundException('User does not exist');
		if (!project.members.flatMap((member) => member.id).includes(userId))
			throw new BadRequestException('User is not a member');
		if (!project.admins.flatMap((admin) => admin.id).includes(userId))
			throw new BadRequestException('User is not an admin');
		if (project.leaderId === userId)
			throw new ForbiddenException('Cannot remove the leader of the project');

		return this.prisma.project.update({
			where: {
				id: projectId,
			},
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

	async delete(id: number) {
		return this.prisma.project.delete({
			where: {
				id: id,
			},
			select: {
				id: true,
			},
		});
	}
}

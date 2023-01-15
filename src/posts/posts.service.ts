import { Injectable } from '@nestjs/common';
import { Prisma, Post } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './post-create.dto';

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async create(data: CreatePostDto, projectId: number, authorId: number) {
		let attachmentData = [];
		if (data.attachments) {
			attachmentData = await this.filesService.generateAttachmentFiles(data.attachments);
		}
		return this.prisma.post.create({
			data: {
				title: data.title,
				content: data.content,
				project: {
					connect: {
						id: projectId,
					},
				},
				author: {
					connect: {
						id: authorId,
					},
				},
				...(attachmentData
					? {
							attachments: {
								createMany: {
									data: attachmentData,
								},
							},
					  }
					: {}),
			},
		});
	}

	async createAttachment(postId: number, isImage: boolean, path: string) {
		return this.prisma.postAttachment.create({
			select: {
				id: true,
				isImage: true,
				postId: true,
				path: true,
			},
			data: {
				post: {
					connect: {
						id: postId,
					},
				},
				isImage: isImage,
				path: path,
			},
		});
	}

	async update(id: number, data: Prisma.PostUpdateInput) {
		return this.prisma.post.update({
			where: {
				id: id,
			},
			data: data,
		});
	}

	async delete(id: number) {
		return this.prisma.post.delete({
			where: {
				id: id,
			},
		});
	}
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { postSelector } from 'prisma/selectors/postSelectors';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
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
			select: postSelector.select,
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

	async createComment(postId: number, content: string, authorId: number) {
		return this.prisma.post.update({
			select: postSelector.select,
			where: {
				id: postId,
			},
			data: {
				comments: {
					create: {
						content: content,
						author: {
							connect: {
								id: authorId,
							},
						},
					},
				},
			},
		});
	}

	async update(id: number, data: Prisma.PostUpdateInput) {
		return this.prisma.post.update({
			where: {
				id: id,
			},
			data: data,
			select: postSelector.select,
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

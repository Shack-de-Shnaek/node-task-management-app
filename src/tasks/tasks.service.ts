import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { taskSelector } from 'prisma/selectors/taskSelectors';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './task-create.dto';
import { UpdateTaskDto } from './task-update.dto';
import { CreateTaskCategoryDto } from './taskCategory-create.dto';
import { CreateTaskCommentDto } from './taskComment-create.dto';

@Injectable()
export class TasksService {
	constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async get(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput, raiseException = true) {
		if (raiseException) {
			return this.prisma.task.findUniqueOrThrow({
				where: { id: taskWhereUniqueInput.id },
				select: taskSelector.select,
			});
		}
		return this.prisma.task.findUnique({
			where: { id: taskWhereUniqueInput.id },
			select: taskSelector.select,
		});
	}

	async create(data: CreateTaskDto, projectId: number, creatorId: number) {
		let attachmentData = [];
		if (data.attachments) {
			attachmentData = await this.filesService.generateAttachmentFiles(data.attachments);
		}

		await this.prisma.taskCategory.findFirstOrThrow({
			where: { id: data.categoryId },
			select: { id: true },
		});
		await this.prisma.taskPriority.findFirstOrThrow({
			where: { code: data.priorityCode },
			select: { id: true },
		});
		await this.prisma.taskSeverity.findFirstOrThrow({
			where: { code: data.severityCode },
			select: { id: true },
		});

		return this.prisma.task.create({
			select: taskSelector.select,
			data: {
				title: data.title,
				description: data.description,
				project: { connect: { id: projectId } },
				createdBy: { connect: { id: creatorId } },
				severity: { connect: { code: data.severityCode } },
				priority: { connect: { code: data.priorityCode } },
				dueAt: new Date(data.dueAt),
				...(!!data.assignedToId
					? {
							assignedTo: {
								connect: {
									id: data.assignedToId,
								},
							},
							assignedAt: new Date(),
							status: {
								connect: {
									code: 'assigned',
								},
							},
					  }
					: {
							status: {
								connect: {
									code: 'submitted',
								},
							},
					  }),
				category: { connect: { id: data.categoryId } },
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

	async createTaskCategory(projectId: number, data: CreateTaskCategoryDto) {
		return this.prisma.taskCategory.create({
			data: {
				project: { connect: { id: projectId } },
				...data,
			},
		});
	}

	async getTaskSeveritiesPrioritiesStatuses() {
		const severities = await this.prisma.taskSeverity.findMany({
			select: {
				id: true,
				code: true,
				name: true,
				description: true,
				color: true,
			},
		});
		const priorities = await this.prisma.taskPriority.findMany({
			select: {
				id: true,
				code: true,
				name: true,
				description: true,
				color: true,
			},
		});
		const statuses = await this.prisma.taskStatus.findMany({
			select: {
				id: true,
				code: true,
				name: true,
				description: true,
				color: true,
			},
		});

		return { severities: severities, priorities: priorities, statuses: statuses };
	}

	async createComment(taskId: number, authorId: number, data: CreateTaskCommentDto) {
		await this.prisma.task.findUniqueOrThrow({
			where: { id: taskId },
			select: { id: true },
		});
		
		let attachments = [];
		if (data.attachments) {

			attachments = await this.filesService.generateAttachmentFiles(data.attachments);
		}

		await this.prisma.taskComment.create({
			select: { id: true },
			data: {
				content: data.content,
				author: {
					connect: {
						id: authorId,
					}
				},
				task: {
					connect: {
						id: taskId,
					}
				},
				...(attachments
					? {
						attachments: {
							createMany: {
								data: attachments,
							},
						},
					}
					: {}),
			}
		});

		return this.get({ id: taskId });
	}

	async update(taskId: number, data: UpdateTaskDto) {
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
			select: { id: true, project: { select: { id: true } }, statusCode: true },
		});

		let attachmentData = [];
		if (data.attachments) {
			attachmentData = await this.filesService.generateAttachmentFiles(data.attachments);
			data.attachments = undefined;
		}

		if (data.severityCode) {
			const severity = await this.prisma.taskSeverity.findUnique({
				where: { code: data.severityCode },
				select: { id: true },
			});
			if (severity === null) throw new NotFoundException('Task severity does not exist');
		}

		if (data.priorityCode) {
			const priority = await this.prisma.taskPriority.findUnique({
				where: { code: data.priorityCode },
				select: { id: true },
			});
			if (priority === null) throw new NotFoundException('Task severity does not exist');
		}

		if (data.statusCode) {
			const status = await this.prisma.taskStatus.findUnique({
				where: { code: data.statusCode },
				select: { id: true },
			});
			if (status === null) throw new NotFoundException('Task severity does not exist');
		}

		if (data.categoryId) {
			const category = await this.prisma.taskCategory.findUnique({
				where: { id: data.categoryId },
				select: { id: true },
			});
			if (category === null) throw new NotFoundException('Task severity does not exist');
		}

		if (data.assignedToId) {
			const user = await this.prisma.user.findUnique({
				where: { id: data.assignedToId },
				select: { id: true },
			});
			if (user === null) throw new NotFoundException('User does not exist');
		}

		return this.prisma.task.update({
			where: { id: taskId },
			select: taskSelector.select,
			data: {
				title: data.title,
				description: data.description,
				...(data.severityCode
					? { severity: { connect: { code: data.severityCode } } }
					: {}),
				...(data.priorityCode
					? { priority: { connect: { code: data.priorityCode } } }
					: {}),
				...(data.statusCode ? { status: { connect: { code: data.statusCode } } } : {}),
				...(data.categoryId ? { category: { connect: { id: data.categoryId } } } : {}),
				...(data.assignedToId
					? {
							assignedTo: { connect: { id: data.assignedToId } },
							assignedAt: new Date(),
							...(task.statusCode === 'submitted'
								? { status: { connect: { code: 'assigned' } } }
								: {}),
					  }
					: {}),
				dueAt: data.dueAt,
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

	async deleteTask(taskId: number) {
		return this.prisma.task.delete({
			where: { id: taskId },
			select: { id: true },
		});
	}

	async createInitialData() {
		await this.prisma.$transaction([
			//severity
			this.prisma.taskSeverity.upsert({
				where: { code: 'low' },
				create: {
					code: 'low',
					name: 'Low',
					description: 'Minor issues with low impact',
					color: '#86AAC1',
				},
				update: {},
			}),
			this.prisma.taskSeverity.upsert({
				where: { code: 'medium' },
				create: {
					code: 'medium',
					name: 'Medium',
					description: 'Major issues with significant impact',
					color: '#F5CC00',
				},
				update: {},
			}),
			this.prisma.taskSeverity.upsert({
				where: { code: 'high' },
				create: {
					code: 'high',
					name: 'High',
					description: 'Critical issues with very high impact',
					color: '#A62626',
				},
				update: {},
			}),

			//priority
			this.prisma.taskPriority.upsert({
				where: { code: 'low' },
				create: {
					code: 'low',
					name: 'Low',
					description: 'Low priority issues',
					color: '#86AAC1',
				},
				update: {},
			}),
			this.prisma.taskPriority.upsert({
				where: { code: 'medium' },
				create: {
					code: 'medium',
					name: 'Medium',
					description: 'Medium priority issues',
					color: '#F5CC00',
				},
				update: {},
			}),
			this.prisma.taskPriority.upsert({
				where: { code: 'high' },
				create: {
					code: 'high',
					name: 'High',
					description: 'High priority issues',
					color: '#A62626',
				},
				update: {},
			}),

			//status
			this.prisma.taskStatus.upsert({
				where: { code: 'submitted' },
				create: {
					code: 'submitted',
					name: 'Submitted',
					description: 'Issues that are not assigned to any user',
					color: '#86AAC1',
				},
				update: {},
			}),
			this.prisma.taskStatus.upsert({
				where: { code: 'assigned' },
				create: {
					code: 'assigned',
					name: 'Assigned',
					description: 'Issues that are assigned to a user but not being worked on',
					color: '#86AAC1',
				},
				update: {},
			}),
			this.prisma.taskStatus.upsert({
				where: { code: 'in-progress' },
				create: {
					code: 'in-progress',
					name: 'In progress',
					description: 'Issues that are currently being worked on',
					color: '#336699',
				},
				update: {},
			}),
			this.prisma.taskStatus.upsert({
				where: { code: 'testing' },
				create: {
					code: 'testing',
					name: 'Testing',
					description: 'Issues that are having their solution test for QA',
					color: '#FE6C0B',
				},
				update: {},
			}),
			this.prisma.taskStatus.upsert({
				where: { code: 'fixed' },
				create: {
					code: 'fixed',
					name: 'Fixed',
					description: 'Issues that have been resolved',
					color: '#395A20',
				},
				update: {},
			}),
			this.prisma.taskStatus.upsert({
				where: { code: 'rejected' },
				create: {
					code: 'rejected',
					name: 'Rejected',
					description:
						'Issues that have been rejected because they were not issues or were a duplicate',
					color: '#A62626',
				},
				update: {},
			}),
		]);

		console.log('Task severity, priority and status objects created.');
	}
}

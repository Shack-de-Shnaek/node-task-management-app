import { Injectable } from '@nestjs/common';
import { taskSelector } from 'prisma/selectors/taskSelectors';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './task-create.dto';
import { CreateTaskCategoryDto } from './taskCategory-create.dto';

@Injectable()
export class TasksService {
	constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async create(data: CreateTaskDto, projectId: number, creatorId: number) {
		let attachmentData = [];
		if (data.attachments) {
			attachmentData = await this.filesService.generateAttachmentFiles(data.attachments);
		}

		await this.prisma.taskCategory.findFirstOrThrow({
			where: {
				id: data.categoryId,
			},
			select: {
				id: true,
			},
		});
		await this.prisma.taskPriority.findFirstOrThrow({
			where: {
				code: data.priorityCode,
			},
			select: {
				id: true,
			},
		});
		await this.prisma.taskSeverity.findFirstOrThrow({
			where: {
				code: data.severityCode,
			},
			select: {
				id: true,
			},
		});

		return this.prisma.task.create({
			select: taskSelector.select,
			data: {
				title: data.title,
				description: data.description,
				project: {
					connect: {
						id: projectId,
					},
				},
				createdBy: {
					connect: {
						id: creatorId,
					},
				},
				severity: {
					connect: {
						code: data.severityCode,
					},
				},
				priority: {
					connect: {
						code: data.priorityCode,
					},
				},
				...(!!data.assignedToId ? {
					assignedTo: {
						connect: {
							id: data.assignedToId
						}
					},
					assignedAt: new Date(),
					status: {
						connect: {
							code: 'assigned'
						}
					}
				} : {
					status: {
						connect: {
							code: 'submitted'
						}
					}
				}),
				category: {
					connect: {
						id: data.categoryId,
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

	async createTaskCategory(projectId: number, data: CreateTaskCategoryDto) {
		return this.prisma.taskCategory.create({
			data: {
				project: {
					connect: {
						id: projectId,
					},
				},
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

	async createInitialData() {
		//severity
		await this.prisma.taskSeverity.upsert({
			where: { code: 'low' },
			create: {
				code: 'low',
				name: 'Low',
				description: 'Minor issues with low impact',
				color: '#86AAC1',
			},
			update: {},
		});
		await this.prisma.taskSeverity.upsert({
			where: { code: 'medium' },
			create: {
				code: 'medium',
				name: 'Medium',
				description: 'Major issues with significant impact',
				color: '#F5CC00',
			},
			update: {},
		});
		await this.prisma.taskSeverity.upsert({
			where: { code: 'high' },
			create: {
				code: 'high',
				name: 'High',
				description: 'Critical issues with very high impact',
				color: '#A62626',
			},
			update: {},
		});
		console.log('Task severity objects created.');

		//priority
		await this.prisma.taskPriority.upsert({
			where: { code: 'low' },
			create: {
				code: 'low',
				name: 'Low',
				description: 'Low priority issues',
				color: '#86AAC1',
			},
			update: {},
		});
		await this.prisma.taskPriority.upsert({
			where: { code: 'medium' },
			create: {
				code: 'medium',
				name: 'Medium',
				description: 'Medium priority issues',
				color: '#F5CC00',
			},
			update: {},
		});
		await this.prisma.taskPriority.upsert({
			where: { code: 'high' },
			create: {
				code: 'high',
				name: 'High',
				description: 'High priority issues',
				color: '#A62626',
			},
			update: {},
		});
		console.log('Task priority objects created.');

		//status
		await this.prisma.taskStatus.upsert({
			where: { code: 'submitted' },
			create: {
				code: 'submitted',
				name: 'Submitted',
				description: 'Issues that are not assigned to any user',
				color: '#86AAC1',
			},
			update: {},
		});
		await this.prisma.taskStatus.upsert({
			where: { code: 'assigned' },
			create: {
				code: 'assigned',
				name: 'Assigned',
				description: 'Issues that are assigned to a user but not being worked on',
				color: '#86AAC1',
			},
			update: {},
		});
		await this.prisma.taskStatus.upsert({
			where: { code: 'in-progress' },
			create: {
				code: 'in-progress',
				name: 'In progress',
				description: 'Issues that are currently being worked on',
				color: '#336699',
			},
			update: {},
		});
		await this.prisma.taskStatus.upsert({
			where: { code: 'testing' },
			create: {
				code: 'testing',
				name: 'Testing',
				description: 'Issues that are having their solution test for QA',
				color: '#FE6C0B',
			},
			update: {},
		});
		await this.prisma.taskStatus.upsert({
			where: { code: 'fixed' },
			create: {
				code: 'fixed',
				name: 'Fixed',
				description: 'Issues that have been resolved',
				color: '#395A20',
			},
			update: {},
		});
		await this.prisma.taskStatus.upsert({
			where: { code: 'rejected' },
			create: {
				code: 'rejected',
				name: 'Rejected',
				description:
					'Issues that have been rejected because they were not issues or were a duplicate',
				color: '#A62626',
			},
			update: {},
		});
		console.log('Task status objects created.');
	}
}

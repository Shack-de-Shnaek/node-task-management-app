import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TasksService implements ICrudService {
    constructor(private prismaService: PrismaService) { }

    async get(taskWhereUniqueImport: Prisma.TaskWhereUniqueInput) {
        const task = await this.prismaService.task.findUnique({
            where: taskWhereUniqueImport
        });
        return task;
    }

    async list(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.TaskWhereUniqueInput;
        where?: Prisma.TaskWhereInput;
        orderBy?: Prisma.TaskOrderByWithRelationInput;
    }) {
        const tasks = await this.prismaService.task.findMany(params);
        return tasks;
    }

    async create(data: Prisma.TaskCreateInput) {
        const task = await this.prismaService.task.create({
            data: data
        });
        return task;
    }

    async update(id: number, data: Prisma.TaskUpdateInput) {
        const task = await this.prismaService.task.update({
            where: {
                id: id
            },
            data: data
        });
        return task;
    }

    async delete(id: number) {
        const task = await this.prismaService.task.delete({
            where: {
                id: id
            }
        });
        return task;
    }
}

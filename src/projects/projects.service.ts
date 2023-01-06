import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { projectLimitedSelector } from 'prisma/selectors/projectSelectors';
import { userLimitedSelector } from 'prisma/selectors/userSelectors';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectsService implements ICrudService {
    constructor(private prisma: PrismaService) { }

    async get(projectWhereUniqueImport: Prisma.ProjectWhereUniqueInput) {
        return this.prisma.project.findUnique({
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                leader: {
                    select: userLimitedSelector
                },
                members: {
                    select: userLimitedSelector
                },
                posts: true,
                tasks: true,
            },
            where: projectWhereUniqueImport
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
            select: projectLimitedSelector,
            ...params
        });
    }

    async create(data: {
        leaderId: number;
        name: string;
        description: string;
    }) {
        return this.prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                leader: {
                    connect: {
                        id: data.leaderId
                    }
                },
                members: {
                    connect: {
                        id: data.leaderId
                    }
                }
            }
        });
    }

    async update(id: number, data: Prisma.ProjectUpdateInput) {
        return this.prisma.project.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async delete(id: number) {
        return this.prisma.project.delete({
            where: {
                id: id
            }
        });
    }
}

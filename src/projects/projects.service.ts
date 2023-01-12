import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { projectLimitedSelector, projectSelector } from 'prisma/selectors/projectSelectors';
import { userLimitedSelector } from 'prisma/selectors/userSelectors';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectsService implements ICrudService {
    constructor(private prisma: PrismaService, private usersService: UsersService) { }

    async get(projectWhereUniqueImport: Prisma.ProjectWhereUniqueInput) {
        return this.prisma.project.findUnique({
            select: projectSelector,
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
                },
                admins: {
                    connect: {
                        id: data.leaderId
                    }
                }
            },
            select: projectSelector
        });
    }

    async update(id: number, data: Prisma.ProjectUpdateInput) {
        return this.prisma.project.update({
            where: {
                id: id
            },
            data: data,
            select: projectSelector
        });
    }

    async addMember(projectId: number, email: string) {
        const user = await this.usersService.get({ email: email });
        if (user === null) throw new NotFoundException('User does not exist');
        return this.prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                members: {
                    connect: {
                        email: email
                    }
                }
            },
            select: projectSelector
        });
    }

    async addAdmin(projectId: number, email: string) {
        const project = await this.prisma.project.findUnique({
            where: {
                id: projectId
            },
            select: {
                members: {
                    select: {
                        email: true
                    }
                }
            }
        });

        if (!project.members.flatMap(user => user.email).includes(email)) throw new BadRequestException('User is not a member of this project');

        return this.prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                admins: {
                    connect: {
                        email: email
                    },
                },
            },
            select: projectSelector
        });
    }

    async delete(id: number) {
        return this.prisma.project.delete({
            where: {
                id: id
            },
            select: {
                id: true
            }
        });
    }
}

import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectsService implements ICrudService {
    constructor(private prismaService: PrismaService) { }

    async get(projectWhereUniqueImport: Prisma.ProjectWhereUniqueInput) {
        return await this.prismaService.project.findUnique({
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
        return await this.prismaService.project.findMany(params);
    }

    async create(data: Prisma.ProjectCreateInput) {
        return await this.prismaService.project.create({
            data: data
        });
    }

    async update(id: number, data: Prisma.ProjectUpdateInput) {
        return await this.prismaService.project.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async delete(id: number) {
        return await this.prismaService.project.delete({
            where: {
                id: id
            }
        });
    }
}

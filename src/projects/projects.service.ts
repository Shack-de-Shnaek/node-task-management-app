import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectsService implements ICrudService {
    constructor(private prisma: PrismaService) { }

    async get(projectWhereUniqueImport: Prisma.ProjectWhereUniqueInput) {
        return this.prisma.project.findUnique({
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
        return this.prisma.project.findMany(params);
    }

    async create(data: Prisma.ProjectCreateInput) {
        return this.prisma.project.create({
            data: data
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

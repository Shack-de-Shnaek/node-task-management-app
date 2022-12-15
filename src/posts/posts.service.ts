import { Injectable } from '@nestjs/common';
import { Prisma, Post } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService implements ICrudService {
    constructor(private prismaService: PrismaService) { }

    async get(postWhereUniqueImport: Prisma.PostWhereUniqueInput) {
        return await this.prismaService.post.findUnique({
            where: postWhereUniqueImport
        });
    }

    async list(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PostWhereUniqueInput;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }) {
        return await this.prismaService.post.findMany(params);
    }

    async create(data: Prisma.PostCreateInput) {
        const post = await this.prismaService.post.create({
            data: data
        });
        return post;
    }

    async update(id: number, data: Prisma.PostUpdateInput) {
        return await this.prismaService.post.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async delete(id: number) {
        return await this.prismaService.post.delete({
            where: {
                id: id
            }
        });
    }
}

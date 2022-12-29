import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import ICrudService from 'interfaces/ICrudService';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService implements ICrudService {
    constructor(private prisma: PrismaService) {}
    
    async get(userWhereUniqueInput: Prisma.UserWhereUniqueInput, getPassword=false) {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: getPassword,
                description: true,
                projects: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                leaderOfProjects: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true
                    }
                },
                createdTasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                }
            }
        });
    }

    async list(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        return this.prisma.user.findMany({
            ...params,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                description: true
            }
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data: data
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async delete(id: number) {
        return this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                isActive: false,
                firstName: 'Deleted',
                lastName: 'User'
            }
        });
    }


    async getProjects(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                leaderOfProjects: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });
    }

    async getPosts(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                        project: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })
    }
}

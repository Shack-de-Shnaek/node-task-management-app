import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    
    async get(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput
        });
    }

    async list(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        return this.prisma.user.findMany(params);
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
        return this.prisma.user.delete({
            where: {
                id: id
            }
        });
    }
}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostsService } from './posts.service';

@Module({
    providers: [PostsService, PrismaService],
    exports: [PostsService]
})
export class PostsModule {}

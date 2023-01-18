import { Module } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { PostsService } from './posts.service';

@Module({
	providers: [PostsService, PrismaService, UsersService, ProjectsService, FilesService],
	exports: [PostsService],
})
export class PostsModule {}

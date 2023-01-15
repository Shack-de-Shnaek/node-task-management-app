import { Module } from '@nestjs/common';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PostsService } from './posts.service';

@Module({
	imports: [FilesModule],
	providers: [PostsService, PrismaService, UsersService, ProjectsService, FilesService],
	exports: [PostsService],
})
export class PostsModule {}

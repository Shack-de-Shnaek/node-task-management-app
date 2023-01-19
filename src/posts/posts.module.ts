import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectsService } from 'src/projects/projects.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PostsService } from './posts.service';

@Module({
	imports: [UsersModule, forwardRef(() => ProjectsModule), TasksModule],
	providers: [
		PostsService,
		PrismaService,
		UsersService,
		ProjectsService,
		FilesService,
		TasksService,
	],
	exports: [PostsService],
})
export class PostsModule {}

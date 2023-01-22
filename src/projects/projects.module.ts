import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { PostsModule } from 'src/posts/posts.module';
import { PostsService } from 'src/posts/posts.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { TasksService } from 'src/tasks/tasks.service';
import { ProjectMemberGuard } from './projectsMember.guard';
import { ProjectAdminGuard } from './projectsAdmin.guard';
import { ProjectLeaderGuard } from './projectsLeader.guard';

@Module({
	imports: [UsersModule, forwardRef(() => PostsModule), forwardRef(() => TasksModule)],
	providers: [
		ProjectsService,
		PrismaService,
		UsersService,
		FilesService,
		PostsService,
		TasksService,
	],
	exports: [ProjectsService],
	controllers: [ProjectsController],
})
export class ProjectsModule {}

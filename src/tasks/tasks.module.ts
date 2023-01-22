import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { FilesService } from 'src/files/files.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectMemberGuard } from 'src/projects/projectsMember.guard';

@Module({
	imports: [forwardRef(() => ProjectsModule)],
	providers: [TasksService, PrismaService, FilesService, ProjectMemberGuard],
	exports: [TasksService],
	controllers: [TasksController],
})
export class TasksModule {
	constructor(private tasksService: TasksService) {}

	onModuleInit() {
		this.tasksService.createInitialData();
	}
}

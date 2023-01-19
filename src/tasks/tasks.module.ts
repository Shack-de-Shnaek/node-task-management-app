import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { FilesService } from 'src/files/files.service';

@Module({
	providers: [TasksService, PrismaService, FilesService],
	exports: [TasksService],
	controllers: [TasksController],
})
export class TasksModule {
	constructor(private tasksService: TasksService) {}

	onModuleInit() {
		this.tasksService.createInitialData();
	}
}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from './tasks.service';

@Module({
    providers: [TasksService, PrismaService],
    exports: [TasksService]
})
export class TasksModule {}

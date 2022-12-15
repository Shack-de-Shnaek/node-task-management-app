import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from './projects.service';

@Module({
    providers: [ProjectsService, PrismaService],
    exports: [ProjectsService]
})
export class ProjectsModule {}

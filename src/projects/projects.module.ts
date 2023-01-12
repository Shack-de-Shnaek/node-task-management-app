import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [ProjectsService, PrismaService, UsersService],
    exports: [ProjectsService],
    controllers: [ProjectsController]
})
export class ProjectsModule {}

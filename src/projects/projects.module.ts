import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ImagesModule } from 'src/images/images.module';
import { ImagesService } from 'src/images/images.service';

@Module({
    imports: [UsersModule, ImagesModule],
    providers: [ProjectsService, PrismaService, UsersService, ImagesService],
    exports: [ProjectsService],
    controllers: [ProjectsController]
})
export class ProjectsModule {}

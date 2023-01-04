import { Controller, Get, NotFoundException, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get()
    async list(@Req() request: Request) {
        const projects = await this.projectsService.list();
        return projects;
    }
    
    @Get(':id')
    async get(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        const project = await this.projectsService.get({ id: id });
        if (project !== null) return project;
        throw new NotFoundException('Project does not exist');
    }
}

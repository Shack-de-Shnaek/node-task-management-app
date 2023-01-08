import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { CreateProjectDto } from './project-create.dto';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get()
    @HttpCode(200)
    async list(@Req() request: Request) {
        const projects = await this.projectsService.list();
        return projects;
    }
    
    @Get(':id')
    @HttpCode(200)
    async get(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        const project = await this.projectsService.get({ id: id });
        if (project !== null) return project;
        throw new NotFoundException('Project does not exist');
    }

    @Post()
    @HttpCode(201)
    async create(@Body(new ValidationPipe()) body: CreateProjectDto, @Req() request) {
        const leaderId: number = request.user.id
        const data = {
            ...body,
            leaderId: leaderId
        }
        const project = await this.projectsService.create(data);
        return project;
    }
}

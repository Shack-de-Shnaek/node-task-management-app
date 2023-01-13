import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe, HttpCode, Delete, Put } from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/sessionAuth.guard';
import { UserEmail } from 'src/users/user-email.dto';
import { CreateProjectDto } from './project-create.dto';
import { UpdateProjectDto } from './project-update.dto';
import { ProjectsService } from './projects.service';
import { ProjectAdminGuard } from './projectsAdmin.guard';
import { ProjectLeaderGuard } from './projectsLeader.guard';

@Controller('api/projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get()
    @HttpCode(200)
    async list() {
        return this.projectsService.list();
    }
    
    @Get(':id')
    @HttpCode(200)
    async get(@Param('id', ParseIntPipe, new ValidationPipe()) id: number) {
        const project = await this.projectsService.get({ id: id });
        if (project === null) throw new NotFoundException('Project does not exist');
        return project;
    }

    @Post()
    @HttpCode(201)
    async create(@Body(new ValidationPipe()) body: CreateProjectDto, @Req() request) {
        const leaderId: number = request.user.id
        const data = {
            ...body,
            leaderId: leaderId
        }
        return this.projectsService.create(data);
    }

    @Put(':id')
    @HttpCode(200)
    @UseGuards(ProjectAdminGuard)
    async update(@Body(new ValidationPipe()) data: UpdateProjectDto, @Param('id', ParseIntPipe) id: number) {
        const project = await this.projectsService.get({ id: id });
        if (project === null) throw new NotFoundException('Project does not exist');
        return this.projectsService.update(id, data);
    }

    @Post(':id/members')
    @HttpCode(200)
    @UseGuards(ProjectAdminGuard)
    async addMember(@Body(new ValidationPipe()) email: UserEmail, @Param('id', ParseIntPipe) projectId: number) {
        const project = await this.projectsService.get({ id: projectId });
        if (project === null) throw new NotFoundException('Project does not exist');
        return this.projectsService.addMember(projectId, email.email);
    }

    @Post(':id/admins')
    @HttpCode(200)
    @UseGuards(ProjectLeaderGuard)
    async addAdmin(@Body('userId', new ValidationPipe()) userId: number, @Param('id', ParseIntPipe) projectId: number) {
        const project = await this.projectsService.get({ id: projectId });
        if (project === null) throw new NotFoundException('Project does not exist');
        return this.projectsService.addAdmin(projectId, userId);
    }

    @Delete(':id/members')
    @HttpCode(200)
    @UseGuards(ProjectAdminGuard)
    async removeMember(@Body('userId', new ValidationPipe()) userId: number, @Param('id', ParseIntPipe) projectId: number) {
        const project = await this.projectsService.get({ id: projectId });
        if (project === null) throw new NotFoundException('Project does not exist');
        return this.projectsService.removeMember(projectId, userId);
    }

    @Delete(':id/admins')
    @HttpCode(200)
    @UseGuards(ProjectLeaderGuard)
    async removeAdmin(@Body('userId', new ValidationPipe()) userId: number, @Param('id', ParseIntPipe) projectId: number) {
        const project = await this.projectsService.get({ id: projectId });
        if (project === null) throw new NotFoundException('Project does not exist');
        return this.projectsService.removeAdmin(projectId, userId);
    }
}

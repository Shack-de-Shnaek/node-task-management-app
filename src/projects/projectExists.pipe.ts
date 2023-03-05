import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectExistsPipe implements PipeTransform {
	constructor(private projectsService: ProjectsService) {}

	async transform(value: number, metadata: ArgumentMetadata) {
		const project = await this.projectsService.get({ id: value }, false);
		if (project === null) throw new NotFoundException('Project does not exist');
		return value;
	}
}

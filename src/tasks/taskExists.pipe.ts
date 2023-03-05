import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Injectable()
export class TaskExistsPipe implements PipeTransform {
	constructor(private tasksService: TasksService) {}

	async transform(value: number, metadata: ArgumentMetadata) {
		const task = await this.tasksService.get({ id: value }, false);
		if (task === null) throw new NotFoundException('Task does not exist');
		return value;
	}
}

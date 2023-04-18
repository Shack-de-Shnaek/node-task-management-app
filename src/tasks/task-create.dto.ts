import {
	IsDataURI,
	IsDateString,
	IsInt,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateTaskDto {
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	title: string;

	@IsString()
	@MinLength(5)
	description: string;

	@IsString()
	@MinLength(3)
	@MaxLength(15)
	priorityCode: string;

	@IsString()
	@MinLength(3)
	@MaxLength(15)
	severityCode: string;

	@IsInt()
	categoryId: number;

	@IsDateString()
	@IsOptional()
	dueAt: string;

	@IsInt()
	@IsOptional()
	assignedToId: number;

	@IsDataURI({ each: true })
	@IsOptional()
	attachments: string[];
}

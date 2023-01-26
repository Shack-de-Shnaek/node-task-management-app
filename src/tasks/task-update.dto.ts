import {
	IsDataURI,
	IsDateString,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class UpdateTaskDto {
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	@IsOptional()
	title: string;

	@IsString()
	@MinLength(5)
	@IsOptional()
	description: string;

	@IsString()
	@MinLength(3)
	@MaxLength(15)
	@IsOptional()
	priorityCode: string;

	@IsString()
	@MinLength(3)
	@MaxLength(15)
	@IsOptional()
	severityCode: string;

	@IsString()
	@MinLength(3)
	@MaxLength(15)
	@IsOptional()
	statusCode: string;

	@IsInt()
	@IsOptional()
	categoryId: number;

	@IsInt()
	@IsOptional()
	assignedToId: number;

	@IsDateString()
	@IsOptional()
	dueAt: string;
	
	@IsDataURI({ each: true })
	@IsOptional()
	attachments: string[];
}

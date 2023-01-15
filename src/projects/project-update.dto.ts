import { IsBoolean, IsDataURI, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDto {
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	@IsOptional()
	name: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsBoolean()
	@IsOptional()
	isActive: boolean;

	@IsDataURI()
	@IsOptional()
	image: string;
}

import { IsDataURI, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	name: string;

	@IsString()
	@MinLength(5)
	description: string;

	@IsDataURI()
	thumbnail;
}

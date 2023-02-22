import { MinLength, MaxLength, IsOptional, IsDataURI } from 'class-validator';

export class UpdateUserDto {
	@MinLength(2)
	@MaxLength(20)
	@IsOptional()
	firstName: string;

	@MinLength(2)
	@MaxLength(20)
	@IsOptional()
	lastName: string;

	@MinLength(5)
	@IsOptional()
	description: string;

	@IsDataURI()
	@IsOptional()
	image: string;
}

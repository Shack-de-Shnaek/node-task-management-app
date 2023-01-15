import { MinLength, MaxLength, IsOptional, IsDataURI } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@MinLength(2)
	@MaxLength(20)
	firstName: string;

	@IsOptional()
	@MinLength(2)
	@MaxLength(20)
	lastName: string;

	@IsDataURI()
	@IsOptional()
	image: string;
}

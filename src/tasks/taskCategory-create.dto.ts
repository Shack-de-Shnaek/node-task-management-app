import { Contains, IsHexColor, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskCategoryDto {
	@IsString()
	@MinLength(3)
	@MaxLength(15)
	name: string;

	@IsHexColor()
	@Contains('#')
	@MaxLength(7)
	color: string;
}

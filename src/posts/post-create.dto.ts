import { IsDataURI, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
	@MinLength(5)
	@MaxLength(100)
	@IsString()
	title: string;

	@MinLength(5)
	@IsString()
	content: string;

	@IsDataURI({ each: true })
	@IsOptional()
	attachments: string[];
}

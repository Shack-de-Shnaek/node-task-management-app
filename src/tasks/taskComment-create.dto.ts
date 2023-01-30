import { IsDataURI, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTaskCommentDto {
    @IsString()
    @MinLength(5)
    content: string;

    @IsDataURI({ each: true })
    @IsOptional()
    attachments: string[];
}
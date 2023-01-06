import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    name: string;
    
    @IsString()
    description: string;
}
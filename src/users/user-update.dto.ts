import { MinLength, MaxLength, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @MinLength(2)
    @MaxLength(20)
    firstName: string;

    @IsOptional()
    @MinLength(2)
    @MaxLength(20)
    lastName: string;

    // @IsBase64()
    @IsOptional()
    image: string;
}
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsNotEmpty()
    @MaxLength(20)
    firstName: string;

    @IsNotEmpty()
    @MaxLength(20)
    lastName: string;
}
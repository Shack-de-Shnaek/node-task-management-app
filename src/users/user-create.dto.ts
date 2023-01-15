import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	password: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(20)
	firstName: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(20)
	lastName: string;
}

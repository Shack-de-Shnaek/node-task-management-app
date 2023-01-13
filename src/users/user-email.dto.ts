import { IsEmail } from "class-validator";

export class UserEmail {
    @IsEmail()
    email: string;
}
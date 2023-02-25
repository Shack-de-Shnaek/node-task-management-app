import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";

@Injectable()
export class UserExistsPipe implements PipeTransform {
    constructor(private usersService: UsersService) {}
    
    async transform(value: number, metadata: ArgumentMetadata) {
        const user = await this.usersService.get({ id: value }, false, false);
        if (user === null) throw new NotFoundException('User does not exist');
        return value;
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
// import { verify } from 'crypto';

@Injectable()
export class AuthService {    
    constructor (private usersService: UsersService) {}

    async validateUser (email: string, password: string) {    
        const user = await this.usersService.get({
            email: email
        }, true);
        if (user === null) throw new NotFoundException();
        const passwordIsCorrect = await compare(password, user.password);
        if (passwordIsCorrect) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}

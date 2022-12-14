import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { verify } from 'crypto';

@Injectable()
export class AuthService {    
    private client = new PrismaClient();

    async validateUser (email: string, password: string) {    
        const user = await this.client.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
            }
        });
        if (user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}

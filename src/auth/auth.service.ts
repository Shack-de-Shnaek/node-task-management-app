import { Injectable } from '@nestjs/common';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { PrismaClient } from '@prisma/client';
// import { verify } from 'crypto';

@Injectable()
export class AuthService {
    private client = new PrismaClient();

    validateUser = async (email: string, password: string) => {
        const user = await this.client.user.findUnique({
            where: {
                email: email
            }
        });
    }
}

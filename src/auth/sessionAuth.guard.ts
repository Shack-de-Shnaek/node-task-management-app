import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Observable } from "rxjs";

@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
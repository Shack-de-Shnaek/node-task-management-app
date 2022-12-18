import { CanActivate, ExecutionContext, Injectable, Redirect, UnauthorizedException } from "@nestjs/common";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Observable } from "rxjs";

@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request.isAuthenticated()) return true;
        throw new UnauthorizedException();
    }
}
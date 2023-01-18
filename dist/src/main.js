"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const session = require("express-session");
const passport = require("passport");
const express_1 = require("express");
const app_module_1 = require("./app.module");
const unauthorizedRedirect_filter_1 = require("./auth/unauthorizedRedirect.filter");
const prisma_exceptions_interceptor_1 = require("./prisma-exceptions.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new prisma_exceptions_interceptor_1.PrismaExceptionsInterceptor());
    app.useGlobalFilters(new unauthorizedRedirect_filter_1.UnauthorizedRedirectFilter());
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use(session({
        secret: 'dmVyeWVwaWNzZWNyZXRrZXl2ZXJ5c2VjcmV0',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2 * 3600 * 1000,
        },
        store: new prisma_session_store_1.PrismaSessionStore(new client_1.PrismaClient(), {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }));
    app.use(passport.session());
    app.use(passport.initialize());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
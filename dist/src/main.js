"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const session = require("express-session");
const passport = require("passport");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(session({
        secret: 'dmVyeWVwaWNzZWNyZXRrZXl2ZXJ5c2VjcmV0',
        resave: false,
        saveUninitialized: false,
        store: new prisma_session_store_1.PrismaSessionStore(new client_1.PrismaClient(), {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
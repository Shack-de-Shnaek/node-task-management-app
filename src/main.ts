import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as session from 'express-session';
import * as passport from 'passport';
import { json } from 'express';
import { AppModule } from './app.module';
import { UnauthorizedRedirectFilter } from './auth/unauthorizedRedirect.filter';
import { PrismaExceptionsInterceptor } from './prisma-exceptions.interceptor';
import * as compression from 'compression';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const { httpAdapter } = app.get(HttpAdapterHost);

	app.useGlobalInterceptors(new PrismaExceptionsInterceptor());
	app.useGlobalFilters(new UnauthorizedRedirectFilter(httpAdapter));
	app.use(
		compression({
			filter: () => true,
			threshold: 0,
		}),
	);
	app.use(json({ limit: '50mb' }));
	app.use(
		session({
			secret: 'dmVyeWVwaWNzZWNyZXRrZXl2ZXJ5c2VjcmV0',
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 2 * 3600 * 1000,
			},
			store: new PrismaSessionStore(new PrismaClient(), {
				checkPeriod: 2 * 60 * 1000,
				dbRecordIdIsSessionId: true,
				dbRecordIdFunction: undefined,
			}),
		}),
	);
	app.use(passport.session());
	app.use(passport.initialize());

	await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(
		session({
			secret: 'dmVyeWVwaWNzZWNyZXRrZXl2ZXJ5c2VjcmV0',
			resave: false,
			saveUninitialized: false,
			store: new PrismaSessionStore(new PrismaClient(),
				{
					checkPeriod: 2 * 60 * 1000,
					dbRecordIdIsSessionId: true,
					dbRecordIdFunction: undefined
				}
			)
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(3000);
}
bootstrap();

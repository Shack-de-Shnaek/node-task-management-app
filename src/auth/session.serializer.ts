import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	serializeUser(user, done: (err: Error, user) => void) {
		done(null, user);
	}
	deserializeUser(payload: any, done: (err: Error, payload: string) => void) {
		done(null, payload);
	}
}

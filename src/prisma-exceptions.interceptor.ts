import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class PrismaExceptionsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === 'P2025' || error.code === 'P2018')
						throw new NotFoundException(error.message);
				}
				throw error;
			}),
		);
	}
}

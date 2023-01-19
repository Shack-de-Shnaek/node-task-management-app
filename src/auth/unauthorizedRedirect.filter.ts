import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	UnauthorizedException,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedRedirectFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse();
		const status = exception.getStatus();

		response.status(status).redirect('/login');
	}
}

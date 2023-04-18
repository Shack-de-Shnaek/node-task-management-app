import { ArgumentsHost, Catch, HttpException, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(UnauthorizedException)
export class UnauthorizedRedirectFilter extends BaseExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const request: Request = context.getRequest();

		if (request.url.includes('/auth/login')) return super.catch(exception, host);

		const response = context.getResponse();

		response.status(401).redirect('/login');
	}
}

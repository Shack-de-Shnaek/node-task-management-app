import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [PassportModule.register({ session: true }), UsersModule],
	providers: [AuthService, LocalStrategy, SessionSerializer],
	controllers: [AuthController]
})
export class AuthModule { }


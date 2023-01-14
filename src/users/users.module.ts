import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { ImagesModule } from 'src/images/images.module';
import { ImagesService } from 'src/images/images.service';

@Module({
  imports: [ImagesModule],
  providers: [UsersService, PrismaService, ImagesService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}

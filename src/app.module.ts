import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { PostsModule } from './posts/posts.module';
import { TasksModule } from './tasks/tasks.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'static'),
      serveRoot: '/static',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    PostsModule,
    TasksModule,
    ImagesModule
  ],
  controllers: [],
  providers: [AppService, PrismaService],
})
export class AppModule {}

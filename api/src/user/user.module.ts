import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './controller/user.controller';
import { UserHelperService } from './service/user-helper/user-helper.service';
import { UserService } from './service/user-service/user.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService]
})
export class UserModule {}

import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './controller/user.controller';
import { UserHelperService } from './service/user-helper/user-helper.service';
import { UserService } from './service/user-service/user.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    forwardRef(() => ChatModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService]
})
export class UserModule {}

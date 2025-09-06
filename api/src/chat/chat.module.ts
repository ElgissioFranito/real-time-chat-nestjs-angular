import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { MessageService } from './service/message/message.service';
import { RoomService } from './service/room-service/room.service';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [ChatGateway, RoomService, ConnectedUserService, JoinedRoomService, MessageService]
})
export class ChatModule { }

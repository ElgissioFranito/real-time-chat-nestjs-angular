import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectedUserI } from 'src/chat/model/connected-user/connected-user.interface';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class ConnectedUserService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
    return this.prisma.connectedUser.create({
      data: {
        socketId: connectedUser.socketId,
        user: {
          connect: {
            id: connectedUser.user.id
          }
        }
      }
    });
  }

  async findByUser(user: UserI): Promise<ConnectedUserI[]> {
    return this.prisma.connectedUser.findMany({
      where: {
        userId: user.id
      }
    });
  }

  async deleteBySocketId(socketId: string) {
    return this.prisma.connectedUser.deleteMany({
      where: {
        socketId
      }
    });
  }

  async deleteAll() {
    await this.prisma.connectedUser.deleteMany({});
  }

}

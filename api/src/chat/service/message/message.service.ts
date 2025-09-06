import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageI } from 'src/chat/model/message/message.interface';
import { RoomI } from 'src/chat/model/room/room.interface';

@Injectable()
export class MessageService {


  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(message: MessageI): Promise<MessageI> {
    return this.prisma.message.create({
      data: {
        text: message.text,
        user: {
          connect: {
            id: message.user.id
          }
        },
        room: {
          connect: {
            id: message.room.id
          }
        }
      }
    });
  }

  async findMessagesForRoom(room: RoomI, options: { page: number, limit: number }): Promise<{ items: MessageI[], meta: { totalItems: number, itemCount: number, itemsPerPage: number, totalPages: number, currentPage: number } }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [messages, totalItems] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where: {
          roomId: room.id
        },
        include: {
          user: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit,
      }),
      this.prisma.message.count({
        where: {
          roomId: room.id
        }
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: messages,
      meta: {
        totalItems,
        itemCount: messages.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

}

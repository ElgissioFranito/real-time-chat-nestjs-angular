import { PrismaService } from 'src/prisma/prisma.service';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {


  constructor(
    private readonly prisma: PrismaService
  ) { }

  async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    return this.prisma.room.create({
      data: {
        name: room.name,
        description: room.description,
        users: {
        connect: [
          { id: creator.id },
          ...room.users.map(u => ({ id: u.id }))
        ]
        }
      }
    });
  }

  async getRoom(roomId: number): Promise<RoomI> {
    return this.prisma.room.findUnique({
      where: {
        id: roomId
      },
      include: {
        users: true
      }
    });
  }

  async getRoomsForUser(userId: number, options: { page: number, limit: number }): Promise<{ items: RoomI[], meta: { totalItems: number, itemCount: number, itemsPerPage: number, totalPages: number, currentPage: number } }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [rooms, totalItems] = await this.prisma.$transaction([
      this.prisma.room.findMany({
        where: {
          users: {
            some: {
              id: userId
            }
          }
        },
        include: {
          users: true
        },
        orderBy: {
          updated_at: 'desc'
        },
        skip,
        take: limit,
      }),
      this.prisma.room.count({
        where: {
          users: {
            some: {
              id: userId
            }
          }
        }
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: rooms,
      meta: {
        totalItems,
        itemCount: rooms.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    return this.prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        users: {
          connect: {
            id: creator.id
          }
        }
      }
    });
  }

}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {

  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>
  ) { }

  async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> { 
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: UserI): Promise<JoinedRoomI[]> {
    return this.joinedRoomRepository.find({ user });
  }

  async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
    return this.joinedRoomRepository.find({ room });
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId });
  }

  import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class JoinedRoomService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
    return this.prisma.joinedRoom.create({
      data: {
        socketId: joinedRoom.socketId,
        user: {
          connect: {
            id: joinedRoom.user.id
          }
        },
        room: {
          connect: {
            id: joinedRoom.room.id
          }
        }
      }
    });
  }

  async findByUser(user: UserI): Promise<JoinedRoomI[]> {
    return this.prisma.joinedRoom.findMany({
      where: {
        userId: user.id
      }
    });
  }

  async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
    return this.prisma.joinedRoom.findMany({
      where: {
        roomId: room.id
      }
    });
  }

  async deleteBySocketId(socketId: string) {
    return this.prisma.joinedRoom.deleteMany({
      where: {
        socketId
      }
    });
  }

  async deleteAll() {
    await this.prisma.joinedRoom.deleteMany({});
  }

}

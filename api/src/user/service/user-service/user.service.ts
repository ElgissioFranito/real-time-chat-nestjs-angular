import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/service/auth.service';
import { ChatGateway } from 'src/chat/gateway/chat.gateway';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
    @Inject(forwardRef(() => ConnectedUserService)) private readonly connectedUserService: ConnectedUserService,
    @Inject(forwardRef(() => ChatGateway)) private readonly chatGateway: ChatGateway
  ) {}

  async create(newUser: UserI): Promise<UserI> {
    const exists = await this.mailExists(newUser.email);
    if (exists) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }

    const passwordHash = await this.hashPassword(newUser.password);

    const user = await this.prisma.user.create({
      data: {
        username: newUser.username,
        email: newUser.email,
        password: passwordHash,
      },
    });

    return this.findOne(user.id);
  }

  async login(user: UserI): Promise<string> {
    const foundUser: User = await this.findByEmail(user.email.toLowerCase());
    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const matches: boolean = await this.validatePassword(
      user.password,
      foundUser.password,
    );
    if (!matches) {
      throw new HttpException(
        'Login was not successfull, wrong credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload: UserI = await this.findOne(foundUser.id);
    return this.authService.generateJwt(payload);
  }


  async logout(user: UserI): Promise<void> {
    const connections = await this.connectedUserService.findByUser(user);
    const socketIds = connections.map(connection => connection.socketId);
    this.chatGateway.disconnectUserSockets(socketIds);
    for (const connection of connections) {
      await this.connectedUserService.deleteBySocketId(connection.socketId);
    }
  }


  async findAll(options: { page: number; limit: number }): Promise<{
    items: UserI[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [users, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: users,
      meta: {
        totalItems,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findAllByUsername(username: string): Promise<UserI[]> {
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: username.toLowerCase(),
        },
      },
    });
  }

  private async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async findOne(id: number): Promise<UserI> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  public getOne(id: number): Promise<UserI> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return !!user;
  }

}

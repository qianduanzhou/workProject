import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existed = await this.prisma.user.findUnique({ where: { username: payload.username } });
    if (existed) {
      throw new BadRequestException('用户名已存在');
    }

    const passwordHash = await hash(payload.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: payload.username,
        passwordHash,
      },
    });

    return this.signToken(user.id, user.username);
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { username: payload.username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const ok = await compare(payload.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return this.signToken(user.id, user.username);
  }

  private signToken(userId: number, username: string) {
    const accessToken = this.jwtService.sign({ sub: userId, username });
    return {
      accessToken,
      user: { id: userId, username },
    };
  }
}

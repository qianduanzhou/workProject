import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
        }),
        ttl: 60 * 10,
      }),
    }),
    AuthModule,
    PlansModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

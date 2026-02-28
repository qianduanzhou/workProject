import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService, PrismaService],
})
export class PlansModule {}

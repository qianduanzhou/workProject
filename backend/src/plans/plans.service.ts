import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../common/prisma.service';
import { CreatePlanDto, QueryPlansDto, UpdatePlanDto } from './dto';

@Injectable()
export class PlansService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(userId: number, query: QueryPlansDto) {
    const cacheKey = `plans:${userId}:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const plans = await this.prisma.plan.findMany({
      where: {
        userId,
        category: query.category,
        dueDate:
          query.startDate || query.endDate
            ? {
                gte: query.startDate ? new Date(query.startDate) : undefined,
                lte: query.endDate ? new Date(query.endDate) : undefined,
              }
            : undefined,
      },
      orderBy: { dueDate: 'asc' },
    });

    await this.cacheManager.set(cacheKey, plans, 60);
    return plans;
  }

  async create(userId: number, payload: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
      data: {
        ...payload,
        dueDate: new Date(payload.dueDate),
        userId,
      },
    });
    await this.invalidateUserCache(userId);
    return plan;
  }

  async update(userId: number, id: number, payload: UpdatePlanDto) {
    const existed = await this.prisma.plan.findFirst({ where: { id, userId } });
    if (!existed) {
      throw new NotFoundException('计划不存在');
    }
    const plan = await this.prisma.plan.update({
      where: { id },
      data: {
        ...payload,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      },
    });
    await this.invalidateUserCache(userId);
    return plan;
  }

  async remove(userId: number, id: number) {
    const existed = await this.prisma.plan.findFirst({ where: { id, userId } });
    if (!existed) {
      throw new NotFoundException('计划不存在');
    }
    await this.prisma.plan.delete({ where: { id } });
    await this.invalidateUserCache(userId);
    return { message: '删除成功' };
  }

  private async invalidateUserCache(userId: number) {
    await this.cacheManager.del(`plans:${userId}:{}`);
  }
}

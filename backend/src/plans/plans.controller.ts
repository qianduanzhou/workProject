import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePlanDto, QueryPlansDto, UpdatePlanDto } from './dto';
import { PlansService } from './plans.service';

type AuthRequest = Request & { user: { userId: number; username: string } };

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findAll(@Req() req: AuthRequest, @Query() query: QueryPlansDto) {
    return this.plansService.findAll(req.user.userId, query);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() body: CreatePlanDto) {
    return this.plansService.create(req.user.userId, body);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePlanDto,
  ) {
    return this.plansService.update(req.user.userId, id, body);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.plansService.remove(req.user.userId, id);
  }
}

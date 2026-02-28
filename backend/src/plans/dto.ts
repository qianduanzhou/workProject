import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @Length(1, 80)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsString()
  @Length(1, 30)
  category!: string;

  @IsIn(['todo', 'doing', 'done'])
  status!: 'todo' | 'doing' | 'done';

  @IsDateString()
  dueDate!: string;
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @Length(1, 80)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  category?: string;

  @IsOptional()
  @IsIn(['todo', 'doing', 'done'])
  status?: 'todo' | 'doing' | 'done';

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class QueryPlansDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => String)
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @Type(() => String)
  @IsDateString()
  endDate?: string;
}

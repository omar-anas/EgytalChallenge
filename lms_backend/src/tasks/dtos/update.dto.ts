import { IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
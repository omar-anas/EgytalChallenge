import { IsNotEmpty, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsIn(['low', 'medium', 'high'])
  priority: string;
}
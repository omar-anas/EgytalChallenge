import { IsOptional, IsEnum, IsString, IsInt, Min, IsIn } from 'class-validator';

export class FilterTasksDto {

  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

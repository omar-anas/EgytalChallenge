import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create.dto';
import { UpdateTaskDto } from './dtos/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { FilterTasksDto } from './dtos/filter.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(@Query() filterDto: FilterTasksDto, @GetUser() user: User) {
    return this.tasksService.findAll(filterDto, user);
  }

  @Patch(':id/complete')
  markAsComplete(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.markAsComplete(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.remove(+id, user);
  }
}
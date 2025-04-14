import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create.dto';
import { UpdateTaskDto } from './dtos/update.dto';
import { User } from '../users/entities/user.entity';
import { FilterTasksDto } from './dtos/filter.dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user:User): Promise<Task> {

    
    
    const newTask = this.tasksRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate,
        priority: createTaskDto.priority || 'medium',//here i did this as default value 
        status: 'pending',
        user: {id : user.id}
      });

      return this.tasksRepository.save(newTask);
  }

  async findAll(filterDto: FilterTasksDto, user: User): Promise<{ tasks: Task[]; total: number }> {
    const { status, page = 1, limit = 10 } = filterDto;

    const query = this.tasksRepository.createQueryBuilder('task');
  
    query.where({ user });
  
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
  
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  
    return { tasks:data, total };
  }
  

  async markAsComplete(id: number, user: User , status:string): Promise<Task> {
    console.log(id , status); 
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    task.status = status;
    return this.tasksRepository.save(task);
  }

  async remove(id: number, user: User): Promise<any> {
   
      const result = await this.tasksRepository.delete({ id, user: { id: user.id } });
      
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }else{
        return {message:"sucessful remove"}
      }
    
  }
}
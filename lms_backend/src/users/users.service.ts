import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository:Repository<User>,
     ) {}


   async create(createUserDto: {email:string, password:string}): Promise<User> {
       const user = this.usersRepository.create(createUserDto);
       return this.usersRepository.save(user);
   }
   
   async findOneByEmail(email: string): Promise<User | null> {
       
      return this.usersRepository.findOne({ where: { email } });
   } 

}

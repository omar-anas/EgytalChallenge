import { Task } from 'src/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'DateRegistered' })
  dateRegistered: Date;


  @OneToMany(() => Task, task => task.user, {
    cascade: false  
  })
  tasks: Task[];

}
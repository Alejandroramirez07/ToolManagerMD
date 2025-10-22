import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor  (
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ){}


    async create(CreateTaskDto: CreateTaskDto): Promise<Task>{
        const task = this.taskRepository.create(CreateTaskDto);
        return this.taskRepository.save(task);
    }

    findAll (): Promise<Task[]> {
        return this.taskRepository.find();
    }

    async findOne(id:number): Promise<Task> {
        const task = await this.taskRepository.findOne({where: {id}});
        if(!task) throw new NotFoundException ('Tarea no encontrada');
        return task;
    }

    async update (id: number, UpdateTask: UpdateTaskDto ): Promise<Task>{
        await this.taskRepository.update(id, UpdateTask);
        return this.findOne(id)

    }

    async remove(id: number ) {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0){
            throw new NotFoundException (' Tarea no encontrada')
        }
    }
}

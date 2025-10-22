import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor( private readonly taksService: TasksService){}

    @Post()
    create(@Body() CreateTaskDto: CreateTaskDto){
        return this.taksService.create(CreateTaskDto);
    }

    @Get()
    findAll(){
        return this.taksService.findAll();
    }

    @Get()
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.taksService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto){
        return this.taksService.update(id,body)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe)id : number){
        return this.taksService.remove(id)
    }

    
}

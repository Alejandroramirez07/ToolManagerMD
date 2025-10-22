import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  findAll() {
    return this.gradesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gradesService.findOne(id);
  }

  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  // Listar notas por estudiante
  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: number) {
    return this.gradesService.findByStudent(studentId);
  }

  // Calcular promedio de notas de un estudiante
  @Get('student/:studentId/average')
  getStudentAverage(@Param('studentId') studentId: number) {
    return this.gradesService.getStudentAverage(studentId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gradesService.remove(id);
  }
}

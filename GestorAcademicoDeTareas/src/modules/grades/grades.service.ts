import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';
import { Grade } from 'src/entities/grade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  async findAll() {
    return await this.gradesRepository.find();
  }

  async findOne(id: number) {
    const gradeFind = await this.gradesRepository.findOne({ where: { id } });
    if (!gradeFind)
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    return gradeFind;
  }

  async create(newGrade: CreateGradeDto) {
    const gradeCreated = this.gradesRepository.create(newGrade);
    return await this.gradesRepository.save(gradeCreated);
  }

  async update(id: number, updateGrade: UpdateGradeDto) {
    await this.gradesRepository.update(id, { ...updateGrade });
    return this.findOne(id);
  }

  /**
   * @description Toma el id del estudiante y devuelve todas sus notas
   * @returns Lista de notas
   */
  async findByStudent(studentId: number) {
    return await this.gradesRepository.find({ where: { studentId } });
  }

  /**
   * @description Toma el id del estudiante y calcula el promedio de sus notas
   * @returns El promedio de las notas
   */
  async getStudentAverage(studentId: number) {
    const grades = await this.findByStudent(studentId);
    if (grades.length === 0) return 0;

    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const averageScore = parseFloat((totalScore / grades.length).toFixed(2));
    return averageScore;
  }

  async remove(id: number) {
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0)
      throw new BadRequestException(
        `Calificación con id #${id} no encontrada.`,
      );
    return { message: 'Calificación eliminada correctamente' };
  }
}

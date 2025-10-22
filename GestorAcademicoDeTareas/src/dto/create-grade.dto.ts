import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateGradeDto {
  @IsInt()
  studentId: number;

  @IsInt()
  taskId: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  score: number;
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GradesService } from './grades.service';
import { Grade } from '../../entities/grade.entity';
import { CreateGradeDto } from '../../dto/create-grade.dto';
import { UpdateGradeDto } from '../../dto/update-grade.dto';

describe('GradesService', () => {
  let service: GradesService;
  let repository: Repository<Grade>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradesService,
        {
          provide: getRepositoryToken(Grade),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GradesService>(GradesService);
    repository = module.get<Repository<Grade>>(getRepositoryToken(Grade));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of grades', async () => {
      const grades = [
        { id: 1, studentId: 1, taskId: 1, score: 4.5 },
        { id: 2, studentId: 2, taskId: 2, score: 5.0 },
      ];

      mockRepository.find.mockResolvedValue(grades);

      const result = await service.findAll();
      expect(result).toEqual(grades);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a grade', async () => {
      const grade = { id: 1, studentId: 1, taskId: 1, score: 4.5 };
      mockRepository.findOne.mockResolvedValue(grade);

      const result = await service.findOne(1);
      expect(result).toEqual(grade);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when grade not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Calificación con id 999 no encontrada',
      );
    });
  });

  describe('create', () => {
    it('should create a new grade', async () => {
      const createGradeDto: CreateGradeDto = {
        studentId: 1,
        taskId: 1,
        score: 4.5,
      };

      const newGrade = { id: 1, ...createGradeDto };
      mockRepository.create.mockReturnValue(newGrade);
      mockRepository.save.mockResolvedValue(newGrade);

      const result = await service.create(createGradeDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createGradeDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newGrade);
      expect(result).toEqual(newGrade);
    });
  });

  describe('update', () => {
    it('should update a grade', async () => {
      const existingGrade = { id: 1, studentId: 1, taskId: 1, score: 4.5 };
      const updatedGrade = { id: 1, studentId: 1, taskId: 1, score: 5.0 };

      const updateDto: UpdateGradeDto = { score: 5.0 };

      mockRepository.findOne.mockResolvedValue(updatedGrade);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedGrade);
    });
  });

  describe('findByStudent', () => {
    it('should return grades for a specific student', async () => {
      const grades = [
        { id: 1, studentId: 1, taskId: 1, score: 4.5 },
        { id: 2, studentId: 1, taskId: 2, score: 5.0 },
      ];

      mockRepository.find.mockResolvedValue(grades);

      const result = await service.findByStudent(1);
      expect(result).toEqual(grades);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { studentId: 1 } });
    });
  });

  describe('getStudentAverage', () => {
    it('should calculate the average of student grades', async () => {
      const grades = [
        { id: 1, studentId: 1, taskId: 1, score: 4.5 },
        { id: 2, studentId: 1, taskId: 2, score: 5.0 },
        { id: 3, studentId: 1, taskId: 3, score: 3.5 },
      ];

      mockRepository.find.mockResolvedValue(grades);

      const result = await service.getStudentAverage(1);
      const expectedAverage = parseFloat(((4.5 + 5.0 + 3.5) / 3).toFixed(2));

      expect(result).toBe(expectedAverage);
    });

    it('should return 0 when student has no grades', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getStudentAverage(1);
      expect(result).toBe(0);
    });

    it('should handle decimal averages correctly', async () => {
      const grades = [
        { id: 1, studentId: 1, taskId: 1, score: 4.3 },
        { id: 2, studentId: 1, taskId: 2, score: 4.7 },
      ];

      mockRepository.find.mockResolvedValue(grades);

      const result = await service.getStudentAverage(1);
      const expectedAverage = parseFloat(((4.3 + 4.7) / 2).toFixed(2));

      expect(result).toBe(expectedAverage);
    });
  });

  describe('remove', () => {
    it('should remove a grade', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Calificación eliminada correctamente' });
    });

    it('should throw BadRequestException when grade not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(BadRequestException);
      await expect(service.remove(999)).rejects.toThrow(
        'Calificación con id #999 no encontrada.',
      );
    });
  });
});


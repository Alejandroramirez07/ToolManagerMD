import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../../entities/task.entity';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Complete homework',
        description: 'Finish math assignment',
        dueDate: '2024-12-31',
        isCompleted: false,
      };

      const newTask = { id: 1, ...createTaskDto };
      mockRepository.create.mockReturnValue(newTask);
      mockRepository.save.mockResolvedValue(newTask);

      const result = await service.create(createTaskDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newTask);
      expect(result).toEqual(newTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2024-12-31',
          isCompleted: false,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          dueDate: '2024-12-31',
          isCompleted: true,
        },
      ];

      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();
      expect(result).toEqual(tasks);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      const task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2024-12-31',
        isCompleted: false,
      };

      mockRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne(1);
      expect(result).toEqual(task);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(999)).rejects.toThrow(
        'Tarea no encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const existingTask = {
        id: 1,
        title: 'Old Title',
        description: 'Old Description',
        dueDate: '2024-12-31',
        isCompleted: false,
      };

      const updatedTask = {
        id: 1,
        title: 'New Title',
        description: 'New Description',
        dueDate: '2024-12-31',
        isCompleted: true,
      };

      const updateDto: UpdateTaskDto = {
        title: 'New Title',
        description: 'New Description',
        isCompleted: true,
      };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(updatedTask);

      const result = await service.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(' Tarea no encontrada');
    });
  });
});


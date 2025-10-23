import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ** Professor and Student Read Access **
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // ** Professor and Student Read Access **
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // ** Professor CRUD Access: Create **
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  // ** Professor CRUD Access: Update **
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.findOne(id);

  // If password is being updated, hash it
  if (updateUserDto.password) {
    user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    // Remove password from DTO to prevent it from being merged as plain text
    delete updateUserDto.password;
  }
  
  // Merge other fields from DTO
  Object.assign(user, updateUserDto);
  
  return this.usersRepository.save(user);
}

  // ** Professor CRUD Access: Delete **
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
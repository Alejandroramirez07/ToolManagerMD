import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

// Mock AuthGuard - replace with your actual AuthGuard (e.g., JwtAuthGuard)
class MockAuthGuard {
    canActivate(context) {
        // Mock a Professor user for full access (for demonstration)
        // Or mock a Student for read-only access
        const request = context.switchToHttp().getRequest();
        request.user = { id: 1, email: 'test@example.com', role: Role.Professor }; // Change to Role.Student to test restrictions
        return true;
    }
}

@UseGuards(MockAuthGuard, RolesGuard) // Global protection for the entire controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ------------------------------------------------------------------
  // Professor: CRUD (Create, Read, Update, Delete)
  // Student: Read-only
  // ------------------------------------------------------------------

  // CRUD: CREATE (Professor Only)
  @Post()
  @Roles(Role.Professor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // CRUD: READ (Professor and Student)
  @Get()
  @Roles(Role.Professor, Role.Student) // Both roles can read the list
  findAll() {
    return this.usersService.findAll();
  }

  // CRUD: READ (Professor and Student)
  @Get(':id')
  @Roles(Role.Professor, Role.Student) // Both roles can read a specific user
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // CRUD: UPDATE (Professor Only)
  @Patch(':id')
  @Roles(Role.Professor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // CRUD: DELETE (Professor Only)
  @Delete(':id')
  @Roles(Role.Professor)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
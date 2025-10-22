import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Export the service/entity if other modules (e.g., Auth) need to use them
  exports: [UsersService, TypeOrmModule.forFeature([User])], 
})
export class UsersModule {}
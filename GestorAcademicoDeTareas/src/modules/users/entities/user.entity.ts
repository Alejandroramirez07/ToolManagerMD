import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../../../common/enums/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; // Used instead of 'name' for standard user identification

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Student, // Defaulting to Student is a common practice
  })
  role: Role;

  @Column()
  passwordHash: string; // It's a common practice to name it clearly (password is hashed)

  @Column({ default: true })
  isActive: boolean;
}
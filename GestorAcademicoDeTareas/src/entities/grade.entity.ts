import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  studentId: number;

  @Column({ nullable: false })
  taskId: number;

  @Column({ nullable: false })
  score: number;










 
  /* 
  @PrimaryGeneratedColumn()
  id: number;
  
  // Relación con el estudiante
  @ManyToOne(() => User, (user) => user.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  // Relación con la tarea
  @ManyToOne(() => Task, (task) => task.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ nullable: false })
  score: number;
  */
}

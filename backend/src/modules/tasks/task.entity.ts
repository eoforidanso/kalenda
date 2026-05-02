import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Family } from '../family/family.entity';

export enum TaskCategory {
  CHORES   = 'chores',
  HOMEWORK = 'homework',
  PERSONAL = 'personal',
}

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'enum', enum: TaskCategory, default: TaskCategory.CHORES })
  category!: TaskCategory;

  @Column({ name: 'assigned_to_name', type: 'varchar', nullable: true, length: 100 })
  @Index()
  assignedToName!: string | null;

  @Column({ name: 'family_id' })
  familyId!: string;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @Column({ default: false })
  done!: boolean;

  @Column({ name: 'done_at', type: 'timestamptz', nullable: true })
  doneAt!: Date | null;

  @Column({ default: 1 })
  stars!: number;

  @Column({ length: 10, default: '⭐' })
  icon!: string;

  @Column({ name: 'is_recurring', default: false })
  isRecurring!: boolean;

  @Column({ name: 'recurrence_rule', type: 'varchar', nullable: true, length: 500 })
  recurrenceRule!: string | null;
}

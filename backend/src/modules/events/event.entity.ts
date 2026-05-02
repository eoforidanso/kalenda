import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Family } from '../family/family.entity';
import { User } from '../users/user.entity';

@Entity('calendar_events')
export class CalendarEvent extends BaseEntity {
  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'start_at', type: 'timestamptz' })
  @Index()
  startAt!: Date;

  @Column({ name: 'end_at', type: 'timestamptz', nullable: true })
  endAt!: Date | null;

  @Column({ name: 'all_day', default: false })
  allDay!: boolean;

  @Column({ name: 'family_id' })
  familyId!: string;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @Column({ name: 'creator_id' })
  creatorId!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @Column({ name: 'assigned_to_name', type: 'varchar', nullable: true, length: 100 })
  assignedToName!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color!: string | null;

  @Column({ name: 'is_recurring', default: false })
  isRecurring!: boolean;

  @Column({ name: 'recurrence_rule', type: 'varchar', nullable: true, length: 500 })
  recurrenceRule!: string | null;
}

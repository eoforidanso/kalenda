import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { User } from '../users/user.entity';

export enum NotificationType {
  PHOTOS   = 'photos',
  REACTIONS = 'reactions',
  SYSTEM   = 'system',
  FAMILY   = 'family',
  EVENTS   = 'events',
  CHORES   = 'chores',
  BIRTHDAY = 'birthday',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ name: 'user_id' })
  @Index()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({ length: 10, default: '🔔' })
  icon!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ default: false })
  read!: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt!: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;
}

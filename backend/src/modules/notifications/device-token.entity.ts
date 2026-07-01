import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { User } from '../users/user.entity';

@Entity('device_tokens')
@Unique(['userId', 'token'])
export class DeviceToken extends BaseEntity {
  @Column({ name: 'user_id' })
  @Index()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ length: 512 })
  token!: string;

  @Column({ length: 32, default: 'web' })
  platform!: string; // 'web' | 'ios' | 'android'
}

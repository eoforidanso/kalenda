import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Family } from './family.entity';
import { User } from '../users/user.entity';

export enum FamilyRole {
  OWNER  = 'owner',
  ADMIN  = 'admin',
  MEMBER = 'member',
}

@Entity('family_members')
@Unique(['familyId', 'userId'])
export class FamilyMember extends BaseEntity {
  @Column({ name: 'family_id' })
  familyId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => Family, (f) => f.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @ManyToOne(() => User, (u) => u.familyMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'enum', enum: FamilyRole, default: FamilyRole.MEMBER })
  role!: FamilyRole;

  @Column({ name: 'display_name', length: 100 })
  displayName!: string;

  @Column({ length: 20, default: '#7c3aed' })
  color!: string;

  @Column({ name: 'joined_at', type: 'timestamptz', default: () => 'NOW()' })
  joinedAt!: Date;
}

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { FamilyMember } from '../family/family-member.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true, length: 255 })
  passwordHash!: string | null;

  @Column({ name: 'google_id', type: 'varchar', nullable: true, unique: true, length: 255 })
  googleId!: string | null;

  @Column({ length: 100 })
  name!: string;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true, length: 500 })
  avatarUrl!: string | null;

  @Column({ name: 'avatar_color', type: 'varchar', length: 20, default: '#7c3aed' })
  avatarColor!: string;

  @Column({ name: 'phone_number', type: 'varchar', nullable: true, length: 20 })
  phoneNumber!: string | null;

  @Column({ name: 'agenda_email_enabled', default: false })
  agendaEmailEnabled!: boolean;

  @Column({ name: 'agenda_email_time', length: 10, default: '7:00 AM' })
  agendaEmailTime!: string;

  @Column({ type: 'varchar', length: 10, default: 'free' })
  plan!: 'free' | 'pro';

  @Column({ name: 'stripe_customer_id', type: 'varchar', nullable: true, length: 255 })
  stripeCustomerId!: string | null;

  @Column({ name: 'plan_expires_at', type: 'timestamptz', nullable: true })
  planExpiresAt!: Date | null;

  @OneToMany(() => FamilyMember, (fm) => fm.user)
  familyMemberships!: FamilyMember[];
}

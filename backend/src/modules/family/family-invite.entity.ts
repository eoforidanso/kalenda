import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('family_invites')
@Index(['token'], { unique: true })
export class FamilyInvite extends BaseEntity {
  @Column({ name: 'family_id' })
  familyId!: string;

  /** email address the invite was sent to */
  @Column({ type: 'varchar', length: 254, nullable: true })
  email!: string | null;

  /** secure random token used in the invite URL */
  @Column({ length: 128 })
  token!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  /** null = not yet used */
  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @Column({ type: 'varchar', name: 'used_by_id', nullable: true })
  usedById!: string | null;
}

import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { User } from '../users/user.entity';
import { FamilyMember } from './family-member.entity';

@Entity('families')
export class Family extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @OneToMany(() => FamilyMember, (fm) => fm.family, { cascade: true })
  members!: FamilyMember[];
}

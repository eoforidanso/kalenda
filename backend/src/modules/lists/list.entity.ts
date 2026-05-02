import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Family } from '../family/family.entity';
import { User } from '../users/user.entity';
import { ListItem } from './list-item.entity';

@Entity('lists')
export class List extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ length: 10, default: '📝' })
  icon!: string;

  @Column({ name: 'family_id' })
  familyId!: string;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @Column({ name: 'created_by_id' })
  createdById!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: User;

  @OneToMany(() => ListItem, (item) => item.list, { cascade: true })
  items!: ListItem[];
}

import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Family } from '../family/family.entity';
import { User } from '../users/user.entity';
import { Photo } from './photo.entity';

@Entity('albums')
export class Album extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

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

  @Column({ name: 'cover_photo_id', type: 'varchar', nullable: true })
  coverPhotoId!: string | null;

  @OneToMany(() => Photo, (p) => p.album)
  photos!: Photo[];
}

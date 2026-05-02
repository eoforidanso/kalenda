import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Family } from '../family/family.entity';
import { User } from '../users/user.entity';
import { Album } from './album.entity';

@Entity('photos')
export class Photo extends BaseEntity {
  @Column({ length: 500 })
  url!: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', nullable: true, length: 500 })
  thumbnailUrl!: string | null;

  @Column({ name: 'original_filename', type: 'varchar', nullable: true, length: 255 })
  originalFilename!: string | null;

  @Column({ name: 'mime_type', length: 50 })
  mimeType!: string;

  @Column({ name: 'size_bytes', type: 'bigint', default: 0 })
  sizeBytes!: number;

  @Column({ type: 'int', nullable: true })
  width!: number | null;

  @Column({ type: 'int', nullable: true })
  height!: number | null;

  @Column({ name: 'taken_at', type: 'timestamptz', nullable: true })
  @Index()
  takenAt!: Date | null;

  @Column({ name: 'uploaded_by_id' })
  uploadedById!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy!: User;

  @Column({ name: 'family_id' })
  familyId!: string;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @Column({ name: 'album_id', type: 'varchar', nullable: true })
  albumId!: string | null;

  @ManyToOne(() => Album, (a) => a.photos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'album_id' })
  album!: Album | null;

  @Column({ name: 'ai_enhanced', default: false })
  aiEnhanced!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;
}

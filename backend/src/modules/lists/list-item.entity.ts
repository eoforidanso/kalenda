import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { List } from './list.entity';

@Entity('list_items')
export class ListItem extends BaseEntity {
  @Column({ name: 'list_id' })
  listId!: string;

  @ManyToOne(() => List, (l) => l.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list!: List;

  @Column({ type: 'text' })
  text!: string;

  @Column({ default: false })
  done!: boolean;

  @Column({ name: 'done_at', type: 'timestamptz', nullable: true })
  doneAt!: Date | null;

  @Column({ name: 'added_by_name', type: 'varchar', length: 100, nullable: true })
  addedByName!: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder!: number;
}

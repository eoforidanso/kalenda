import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

export enum TransactionType {
  EXPENSE = 'expense',
  SAVING  = 'saving',
  INCOME  = 'income',
}

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ name: 'family_id' })
  @Index()
  familyId!: string;

  @Column({ type: 'enum', enum: TransactionType, default: TransactionType.EXPENSE })
  type!: TransactionType;

  @Column({ length: 255 })
  label!: string;

  /** Amount in the family's home currency (stored as cents to avoid float issues) */
  @Column({ type: 'int' })
  amountCents!: number;

  @Column({ length: 100 })
  category!: string;

  @Column({ type: 'varchar', name: 'who', length: 100, nullable: true })
  who!: string | null;

  /** ISO date string e.g. 2026-05-04 */
  @Column({ name: 'date', type: 'date' })
  date!: string;
}

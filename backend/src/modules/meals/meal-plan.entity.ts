import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

@Entity('meal_plans')
@Index(['familyId', 'weekStart', 'day', 'mealType'], { unique: true })
export class MealPlan extends BaseEntity {
  @Column({ name: 'family_id' })
  @Index()
  familyId!: string;

  /** ISO date of the Monday for this week e.g. 2026-05-04 */
  @Column({ name: 'week_start', type: 'date' })
  weekStart!: string;

  @Column({ length: 10 })
  day!: DayOfWeek;

  @Column({ name: 'meal_type', length: 20 })
  mealType!: MealType;

  @Column({ length: 255 })
  meal!: string;

  @Column({ length: 100, nullable: true })
  cook!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;
}

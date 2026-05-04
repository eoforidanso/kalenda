import { DataSource, Repository } from 'typeorm';
import { MealPlan, DayOfWeek, MealType } from './meal-plan.entity';

export interface UpsertMealDto {
  weekStart: string;
  day: DayOfWeek;
  mealType: MealType;
  meal: string;
  cook?: string;
  notes?: string;
}

export class MealPlanService {
  private repo: Repository<MealPlan>;

  constructor(db: DataSource) {
    this.repo = db.getRepository(MealPlan);
  }

  async getWeek(familyId: string, weekStart: string) {
    return this.repo.find({ where: { familyId, weekStart } });
  }

  async upsert(familyId: string, dto: UpsertMealDto) {
    const existing = await this.repo.findOne({
      where: { familyId, weekStart: dto.weekStart, day: dto.day, mealType: dto.mealType },
    });
    if (existing) {
      Object.assign(existing, { meal: dto.meal, cook: dto.cook ?? null, notes: dto.notes ?? null });
      return this.repo.save(existing);
    }
    return this.repo.save(
      this.repo.create({ ...dto, cook: dto.cook ?? null, notes: dto.notes ?? null, familyId }),
    );
  }

  async remove(familyId: string, weekStart: string, day: DayOfWeek, mealType: MealType) {
    await this.repo.delete({ familyId, weekStart, day, mealType });
  }
}

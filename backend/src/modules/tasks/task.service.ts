import { DataSource, Repository } from 'typeorm';
import { Task, TaskCategory } from './task.entity';

export interface CreateTaskDto {
  title: string;
  category?: TaskCategory;
  assignedToName?: string;
  stars?: number;
  icon?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

function err(msg: string, status: number) {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class TaskService {
  private repo: Repository<Task>;

  constructor(db: DataSource) {
    this.repo = db.getRepository(Task);
  }

  async list(familyId: string, assignedToName?: string, category?: TaskCategory) {
    const where: any = { familyId };
    if (assignedToName) where.assignedToName = assignedToName;
    if (category)       where.category       = category;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async create(familyId: string, dto: CreateTaskDto) {
    return this.repo.save(this.repo.create({ ...dto, familyId }));
  }

  async update(id: string, familyId: string, dto: Partial<CreateTaskDto> & { done?: boolean }) {
    const task = await this.repo.findOne({ where: { id, familyId } });
    if (!task) throw err('Task not found', 404);
    if (dto.done !== undefined && dto.done !== task.done) {
      task.done  = dto.done;
      task.doneAt = dto.done ? new Date() : null;
    }
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string, familyId: string) {
    const res = await this.repo.delete({ id, familyId });
    if (!res.affected) throw err('Task not found', 404);
  }
}

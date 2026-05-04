import { DataSource, Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CalendarEvent } from './event.entity';
import { parsePagination } from '../../shared/pagination';

export interface CreateEventDto {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  allDay?: boolean;
  assignedToName?: string;
  color?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

function err(msg: string, status: number) {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class EventService {
  private repo: Repository<CalendarEvent>;

  constructor(db: DataSource) {
    this.repo = db.getRepository(CalendarEvent);
  }

  async list(familyId: string, from?: Date, to?: Date, page = 1, limit = 50) {
    const { skip } = parsePagination({ page, limit: Math.min(limit, 200) });
    const where: any = { familyId };
    if (from && to)   where.startAt = Between(from, to);
    else if (from)    where.startAt = MoreThanOrEqual(from);
    else if (to)      where.startAt = LessThanOrEqual(to);
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { startAt: 'ASC' },
      relations: ['creator'],
      skip,
      take: Math.min(limit, 200),
    });
    return { data, total, page, limit };
  }

  async create(familyId: string, creatorId: string, dto: CreateEventDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        startAt: new Date(dto.startAt),
        endAt: dto.endAt ? new Date(dto.endAt) : null,
        familyId,
        creatorId,
      }),
    );
  }

  async update(id: string, familyId: string, dto: Partial<CreateEventDto>) {
    const event = await this.repo.findOne({ where: { id, familyId } });
    if (!event) throw err('Event not found', 404);
    Object.assign(event, {
      ...dto,
      startAt: dto.startAt ? new Date(dto.startAt) : event.startAt,
      endAt:   dto.endAt   ? new Date(dto.endAt)   : event.endAt,
    });
    return this.repo.save(event);
  }

  async remove(id: string, familyId: string) {
    const res = await this.repo.delete({ id, familyId });
    if (!res.affected) throw err('Event not found', 404);
  }
}

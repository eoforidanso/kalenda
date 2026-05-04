import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { parsePagination } from '../../shared/pagination';

export interface CreateTransactionDto {
  type: TransactionType;
  label: string;
  amountCents: number;
  category: string;
  who?: string;
  date: string;
}

function err(msg: string, status: number) {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class TransactionService {
  private repo: Repository<Transaction>;

  constructor(db: DataSource) {
    this.repo = db.getRepository(Transaction);
  }

  async list(familyId: string, page = 1, limit = 50) {
    const { skip } = parsePagination({ page, limit });
    const [data, total] = await this.repo.findAndCount({
      where: { familyId },
      order: { date: 'DESC', createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async create(familyId: string, dto: CreateTransactionDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        who: dto.who ?? null,
        familyId,
      }),
    );
  }

  async remove(id: string, familyId: string) {
    const res = await this.repo.delete({ id, familyId });
    if (!res.affected) throw err('Transaction not found', 404);
  }
}

import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

export interface UpdateUserDto {
  name?: string;
  avatarColor?: string;
  phoneNumber?: string | null;
  agendaEmailEnabled?: boolean;
  agendaEmailTime?: string;
}

export class UserService {
  private repo: Repository<User>;

  constructor(db: DataSource) {
    this.repo = db.getRepository(User);
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.repo.update(id, dto);
    return this.repo.findOneOrFail({ where: { id } });
  }
}

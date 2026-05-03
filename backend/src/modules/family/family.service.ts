import { DataSource, Repository } from 'typeorm';
import { Family } from './family.entity';
import { FamilyMember, FamilyRole } from './family-member.entity';
import { User } from '../users/user.entity';

function err(msg: string, status: number) {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class FamilyService {
  private families: Repository<Family>;
  private members:  Repository<FamilyMember>;
  private users:    Repository<User>;

  constructor(db: DataSource) {
    this.families = db.getRepository(Family);
    this.members  = db.getRepository(FamilyMember);
    this.users    = db.getRepository(User);
  }

  async getFamily(familyId: string) {
    return this.families.findOne({
      where: { id: familyId },
      relations: ['members', 'members.user'],
    });
  }

  async createFamily(ownerId: string, name: string) {
    const user   = await this.users.findOneOrFail({ where: { id: ownerId } });
    const family = await this.families.save(this.families.create({ name, ownerId }));
    await this.members.save(
      this.members.create({
        familyId: family.id, userId: ownerId,
        role: FamilyRole.OWNER, displayName: user.name, color: user.avatarColor,
      }),
    );
    return this.getFamily(family.id);
  }

  async addMember(familyId: string, userId: string, displayName: string, color: string) {
    const exists = await this.members.findOne({ where: { familyId, userId } });
    if (exists) throw err('Already a member', 409);
    return this.members.save(
      this.members.create({ familyId, userId, role: FamilyRole.MEMBER, displayName, color }),
    );
  }

  async removeMember(familyId: string, userId: string) {
    await this.members.delete({ familyId, userId });
  }

  async assertMember(familyId: string, userId: string) {
    const m = await this.members.findOne({ where: { familyId, userId } });
    if (!m) throw err('Access denied', 403);
  }

  async assertOwner(familyId: string, userId: string) {
    const m = await this.members.findOne({ where: { familyId, userId } });
    if (!m || m.role !== FamilyRole.OWNER) throw err('Only the family owner can do this', 403);
  }
}

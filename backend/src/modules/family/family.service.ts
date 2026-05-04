import { DataSource, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Family } from './family.entity';
import { FamilyMember, FamilyRole } from './family-member.entity';
import { FamilyInvite } from './family-invite.entity';
import { User } from '../users/user.entity';

function err(msg: string, status: number) {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class FamilyService {
  private families: Repository<Family>;
  private members:  Repository<FamilyMember>;
  private users:    Repository<User>;
  private invites:  Repository<FamilyInvite>;

  constructor(db: DataSource) {
    this.families = db.getRepository(Family);
    this.members  = db.getRepository(FamilyMember);
    this.users    = db.getRepository(User);
    this.invites  = db.getRepository(FamilyInvite);
  }

  async getFamily(familyId: string) {
    return this.families.findOne({
      where: { id: familyId },
      relations: ['members', 'members.user'],
    });
  }

  async getMyFamily(userId: string) {
    const member = await this.members.findOne({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
    if (!member) return null;
    return this.getFamily(member.familyId);
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

  // ─── Invites ──────────────────────────────────────────────────────────────────

  async createInvite(familyId: string, email: string | null): Promise<FamilyInvite> {
    const token     = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return this.invites.save(
      this.invites.create({ familyId, email, token, expiresAt, usedAt: null, usedById: null }),
    );
  }

  async validateInvite(token: string): Promise<FamilyInvite> {
    const invite = await this.invites.findOne({ where: { token } });
    if (!invite)              throw err('Invite not found', 404);
    if (invite.usedAt)        throw err('Invite already used', 410);
    if (invite.expiresAt < new Date()) throw err('Invite expired', 410);
    return invite;
  }

  async acceptInvite(token: string, userId: string, displayName: string, color: string) {
    const invite = await this.validateInvite(token);
    // Check not already a member
    const existing = await this.members.findOne({ where: { familyId: invite.familyId, userId } });
    if (existing) {
      // Mark used anyway so invite can't be replayed
      await this.invites.update(invite.id, { usedAt: new Date(), usedById: userId });
      return existing;
    }
    const member = await this.addMember(invite.familyId, userId, displayName, color);
    await this.invites.update(invite.id, { usedAt: new Date(), usedById: userId });
    return member;
  }
}

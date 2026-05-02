import { DataSource, Repository, IsNull } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { Family } from '../family/family.entity';
import { FamilyMember, FamilyRole } from '../family/family-member.entity';
import { env } from '../../config/env';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  familyName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function err(msg: string, status: number): Error {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class AuthService {
  private users:   Repository<User>;
  private tokens:  Repository<RefreshToken>;
  private families: Repository<Family>;
  private members: Repository<FamilyMember>;

  constructor(db: DataSource) {
    this.users    = db.getRepository(User);
    this.tokens   = db.getRepository(RefreshToken);
    this.families = db.getRepository(Family);
    this.members  = db.getRepository(FamilyMember);
  }

  async register(dto: RegisterDto) {
    const existing = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw err('Email already in use', 409);

    const passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
    const user = await this.users.save(
      this.users.create({ email: dto.email.toLowerCase(), passwordHash, name: dto.name }),
    );

    let familyId: string | null = null;
    if (dto.familyName) {
      const family = await this.families.save(
        this.families.create({ name: dto.familyName, ownerId: user.id }),
      );
      await this.members.save(
        this.members.create({
          familyId: family.id, userId: user.id,
          role: FamilyRole.OWNER, displayName: dto.name, color: user.avatarColor,
        }),
      );
      familyId = family.id;
    }

    const tokens = await this.issueTokens(user, familyId);
    const { passwordHash: _, ...safeUser } = user;
    return { ...tokens, user: { ...safeUser, familyId } };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw err('Invalid credentials', 401);

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw err('Invalid credentials', 401);

    const member = await this.members.findOne({ where: { userId: user.id }, order: { joinedAt: 'ASC' } });
    const tokens = await this.issueTokens(user, member?.familyId ?? null);
    const { passwordHash: _, ...safeUser } = user;
    return { ...tokens, user: { ...safeUser, familyId: member?.familyId ?? null } };
  }

  async refresh(incoming: string): Promise<TokenPair> {
    let payload: { sub: string; familyId: string | null; type: string };
    try {
      payload = jwt.verify(incoming, env.JWT_REFRESH_SECRET) as typeof payload;
    } catch {
      throw err('Invalid refresh token', 401);
    }
    if (payload.type !== 'refresh') throw err('Invalid token type', 401);

    const tokenHash = this.hash(incoming);
    const stored = await this.tokens.findOne({ where: { tokenHash, userId: payload.sub } });
    if (!stored || stored.revokedAt !== null || new Date() > stored.expiresAt) {
      throw err('Refresh token expired or revoked', 401);
    }

    // Rotate — revoke old, issue new
    stored.revokedAt = new Date();
    await this.tokens.save(stored);

    const user = await this.users.findOneOrFail({ where: { id: payload.sub } });
    return this.issueTokens(user, payload.familyId);
  }

  async logout(userId: string) {
    await this.tokens.update({ userId, revokedAt: IsNull() }, { revokedAt: new Date() });
  }

  // ── private ──────────────────────────────────────────────────

  private async issueTokens(user: User, familyId: string | null): Promise<TokenPair> {
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, familyId, type: 'access' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions,
    );
    const refreshToken = jwt.sign(
      { sub: user.id, familyId, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.tokens.save(
      this.tokens.create({ userId: user.id, tokenHash: this.hash(refreshToken), expiresAt }),
    );
    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }

  private hash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

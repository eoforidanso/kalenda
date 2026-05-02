import { DataSource, Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';

export class NotificationService {
  private repo: Repository<Notification>;

  constructor(db: DataSource) {
    this.repo = db.getRepository(Notification);
  }

  async list(userId: string, onlyUnread = false) {
    const where: any = { userId };
    if (onlyUnread) where.read = false;
    return this.repo.find({ where, order: { createdAt: 'DESC' }, take: 50 });
  }

  async markRead(id: string, userId: string) {
    await this.repo.update({ id, userId }, { read: true, readAt: new Date() });
  }

  async markAllRead(userId: string) {
    await this.repo.update({ userId, read: false }, { read: true, readAt: new Date() });
  }

  async create(
    userId: string,
    type: NotificationType,
    icon: string,
    title: string,
    body: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.repo.save(
      this.repo.create({ userId, type, icon, title, body, metadata: metadata ?? null }),
    );
  }

  async dismiss(id: string, userId: string) {
    await this.repo.delete({ id, userId });
  }
}

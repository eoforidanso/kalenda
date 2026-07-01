import { DataSource, Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';
import { DeviceToken } from './device-token.entity';
import { getMessaging } from '../../config/firebase';

export class NotificationService {
  private repo: Repository<Notification>;
  private deviceRepo: Repository<DeviceToken>;

  constructor(db: DataSource) {
    this.repo       = db.getRepository(Notification);
    this.deviceRepo = db.getRepository(DeviceToken);
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
    const notification = await this.repo.save(
      this.repo.create({ userId, type, icon, title, body, metadata: metadata ?? null }),
    );
    // Best-effort FCM push — never throws if push fails
    this.sendPush(userId, title, body).catch(() => {});
    return notification;
  }

  async dismiss(id: string, userId: string) {
    await this.repo.delete({ id, userId });
  }

  async registerDeviceToken(userId: string, token: string, platform: string) {
    const existing = await this.deviceRepo.findOne({ where: { userId, token } });
    if (!existing) {
      await this.deviceRepo.save(this.deviceRepo.create({ userId, token, platform }));
    }
  }

  async unregisterDeviceToken(userId: string, token: string) {
    await this.deviceRepo.delete({ userId, token });
  }

  private async sendPush(userId: string, title: string, body: string) {
    const messaging = getMessaging();
    if (!messaging) return;

    const devices = await this.deviceRepo.find({ where: { userId } });
    if (!devices.length) return;

    const tokens = devices.map(d => d.token);
    const response = await messaging.sendEachForMulticast({ tokens, notification: { title, body } });

    // Remove tokens FCM has invalidated
    const stale = response.responses
      .map((r: { success: boolean }, i: number) => (!r.success ? tokens[i] : null))
      .filter((t: string | null): t is string => t !== null);

    if (stale.length) {
      await Promise.all(stale.map((token: string) => this.deviceRepo.delete({ userId, token })));
    }
  }
}

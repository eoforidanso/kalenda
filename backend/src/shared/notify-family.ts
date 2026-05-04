import { DataSource } from 'typeorm';
import { NotificationService } from '../modules/notifications/notification.service';
import { FamilyMember } from '../modules/family/family-member.entity';
import { NotificationType } from '../modules/notifications/notification.entity';

/**
 * Broadcast a notification to all members of a family.
 * Skips the triggering user (actorId) to avoid self-notifications.
 */
export async function notifyFamily(
  db: DataSource,
  familyId: string,
  actorId: string,
  type: NotificationType,
  icon: string,
  title: string,
  body: string,
  metadata?: Record<string, unknown>,
) {
  const memberRepo = db.getRepository(FamilyMember);
  const members    = await memberRepo.find({ where: { familyId } });
  const svc        = new NotificationService(db);
  await Promise.all(
    members
      .filter(m => m.userId !== actorId)
      .map(m => svc.create(m.userId, type, icon, title, body, metadata)),
  );
}

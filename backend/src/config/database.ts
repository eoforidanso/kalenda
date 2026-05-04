import { DataSource } from 'typeorm';
import { env } from './env';

// Entities — imported here to register with TypeORM
import { User }           from '../modules/users/user.entity';
import { RefreshToken }   from '../modules/auth/refresh-token.entity';
import { Family }         from '../modules/family/family.entity';
import { FamilyMember }   from '../modules/family/family-member.entity';
import { CalendarEvent }  from '../modules/events/event.entity';
import { Task }           from '../modules/tasks/task.entity';
import { List }           from '../modules/lists/list.entity';
import { ListItem }       from '../modules/lists/list-item.entity';
import { Photo }          from '../modules/photos/photo.entity';
import { Album }          from '../modules/photos/album.entity';
import { Notification }   from '../modules/notifications/notification.entity';
import { Transaction }    from '../modules/budget/transaction.entity';
import { MealPlan }       from '../modules/meals/meal-plan.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  // Use synchronize only in development — run migrations in production
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities: [
    User, RefreshToken,
    Family, FamilyMember,
    CalendarEvent,
    Task,
    List, ListItem,
    Photo, Album,
    Notification,
    Transaction,
    MealPlan,
  ],
  migrations: ['dist/migrations/*.js'],
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

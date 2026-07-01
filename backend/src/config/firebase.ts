import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging as _getMessaging, Messaging } from 'firebase-admin/messaging';
import { env } from './env';

let _app: App | null = null;

function getApp(): App | null {
  if (_app) return _app;

  const projectId   = env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;

  _app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

  return _app;
}

export function getMessaging(): Messaging | null {
  const app = getApp();
  return app ? _getMessaging(app) : null;
}

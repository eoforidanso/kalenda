import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as _logEvent } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { apiFetch } from '../api/client';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);

let app, analytics, messaging;

if (isConfigured) {
  app       = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  messaging = getMessaging(app);
}

/** Log a Firebase Analytics event. No-op if Firebase is not configured. */
export function logEvent(name, params) {
  if (analytics) _logEvent(analytics, name, params);
}

/**
 * Request notification permission and register the FCM token with the backend.
 * Safe to call after login — silently no-ops if Firebase is not configured or
 * the user denies permission.
 */
export async function setupPushNotifications() {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) return;

    const platform = detectPlatform();
    await apiFetch('/notifications/fcm-token', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });

    // Handle foreground push messages (show in-app toast or re-fetch notifications)
    onMessage(messaging, (payload) => {
      window.dispatchEvent(new CustomEvent('kalenda:push', { detail: payload }));
    });
  } catch {
    // Permission denied or service worker not available — silently skip
  }
}

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/android/i.test(ua))         return 'android';
  return 'web';
}

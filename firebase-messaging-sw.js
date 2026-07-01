// Service worker for Firebase Cloud Messaging background push notifications.
// This file must live at the root (public/) so Firebase can register it as
// /firebase-messaging-sw.js without a scope conflict.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyAmqN1aewgF_0asJIK81nJyxxiCSpoiRP4',
  authDomain:        'kalenda-bcea9.firebaseapp.com',
  projectId:         'kalenda-bcea9',
  storageBucket:     'kalenda-bcea9.firebasestorage.app',
  messagingSenderId: '979375976229',
  appId:             '1:979375976229:web:050fd5c2b58fd3d61534cc',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title = 'Kalenda', body = '' } = payload.notification ?? {};
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
  });
});

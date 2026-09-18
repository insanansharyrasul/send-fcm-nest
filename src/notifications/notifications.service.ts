import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { NotificationDto } from './notifications.dto';
import { ConfigService } from '@nestjs/config';

type FirebaseServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function isFirebaseServiceAccount(
  value: unknown,
): value is FirebaseServiceAccount {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const account = value as Record<string, unknown>;

  return (
    typeof account.project_id === 'string' &&
    typeof account.client_email === 'string' &&
    typeof account.private_key === 'string'
  );
}

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {
    if (getApps().length === 0) {
      const credentialPath = this.configService.getOrThrow<string>(
        'FIREBASE_CREDENTIALS_PATH',
      );
      const fileContents = readFileSync(
        join(process.cwd(), credentialPath),
        'utf8',
      );

      const parsed: unknown = JSON.parse(fileContents);

      if (!isFirebaseServiceAccount(parsed)) {
        throw new Error('Invalid Firebase service-account file');
      }

      initializeApp({
        credential: cert({
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key,
        }),
      });
    }
  }

  getTestNotification(): string {
    return 'This is a notification';
  }

  sendNotification(notification: NotificationDto): Promise<string> {
    return getMessaging().send({
      topic: notification.topic,
      notification: {
        title: notification.title,
        body: notification.description,
      },
    });
  }
}

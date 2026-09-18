# Send FCM Notifications

A NestJS API for sending Firebase Cloud Messaging notifications to a device token.

## Project setup

```bash
pnpm install
```

### Firebase credentials

Set `FIREBASE_CREDENTIALS_PATH` to a Firebase service-account JSON path relative
to the project root:

```bash
export FIREBASE_CREDENTIALS_PATH=learn-fcm-5935e-firebase-adminsdk-fbsvc-f0570c01b4.json
```

Keep service-account credentials private and do not commit them to source control.

## Run the API

```bash
pnpm run start:dev
```

The API listens on `http://localhost:3000` by default.

## Send a notification

Replace `YOUR_FCM_DEVICE_TOKEN` with a valid FCM registration token:

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Hello from FCM",
    "description": "This is a test notification.",
    "token": "YOUR_FCM_DEVICE_TOKEN"
  }'
```

On success, Firebase returns a message ID. An invalid or expired device token
returns a Firebase error.

## Run tests

```bash
# unit tests
pnpm test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

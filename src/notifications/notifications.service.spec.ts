import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

const mockSend = jest.fn();

jest.mock('firebase-admin/app', () => ({
  cert: jest.fn(),
  getApps: jest.fn().mockReturnValue([]),
  initializeApp: jest.fn(),
}));

jest.mock('firebase-admin/messaging', () => ({
  getMessaging: jest.fn(() => ({
    send: mockSend,
  })),
}));

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    mockSend.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a test notification', () => {
    expect(service.getTestNotification()).toBe('This is a notification');
  });

  it('sends an FCM notification', async () => {
    mockSend.mockResolvedValue('firebase-message-id');

    const notification = {
      topic: 'topic',
      title: 'Hello',
      description: 'Test notification',
    };

    const result = await service.sendNotification(notification);

    expect(result).toBe('firebase-message-id');
    expect(mockSend).toHaveBeenCalledWith({
      topic: 'topic',
      notification: {
        title: 'Hello',
        body: 'Test notification',
      },
    });
  });

  it('propagates Firebase errors', async () => {
    mockSend.mockRejectedValue(new Error('Firebase failed'));

    await expect(
      service.sendNotification({
        topic: 'topic',
        title: 'Hello',
        description: 'Test notification',
      }),
    ).rejects.toThrow('Firebase failed');
  });
});

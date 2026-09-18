import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './notifications.dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: {
    sendNotification: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      sendNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('sends a notification through the service', async () => {
    const notification: NotificationDto = {
      topic: 'topic',
      title: 'Hello',
      description: 'Test notification',
    };

    service.sendNotification.mockResolvedValue('firebase-message-id');

    const result = await controller.sendNotification(notification);

    expect(result).toBe('firebase-message-id');
    expect(service.sendNotification).toHaveBeenCalledWith(notification);
  });
});

import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('send')
  sendNotification(@Body() notification: NotificationDto): Promise<string> {
    return this.notificationService.sendNotification(notification);
  }
}

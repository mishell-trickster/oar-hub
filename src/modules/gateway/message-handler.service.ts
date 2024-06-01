import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RawData } from 'ws';

import { MessageService } from 'modules/message/message.service';

import { MessageDto } from './dto/message.dto';
import { WebSocketWithKey } from './types';

@Injectable()
export class MessageHandlerService {
  private readonly logger = new Logger(MessageHandlerService.name);
  constructor(private readonly messageService: MessageService) {}

  async handleMessage(_: WebSocketWithKey, message: RawData): Promise<void> {
    try {
      const messageDto = await this.parseMessage(message as RawData);
      this.logger.log('Message from client:', JSON.stringify(messageDto));
      this.messageService.resolveMessage(messageDto);
    } catch (error) {
      this.logger.error('Error handling message:', error);
    }
  }

  private async parseMessage(rawMessage: RawData): Promise<MessageDto> {
    try {
      const messageStr = rawMessage.toString();
      const response = plainToClass(MessageDto, JSON.parse(messageStr));
      try {
        await validateOrReject(response);
      } catch (errors) {
        throw new HttpException(`Validation failed, service answered with wrong format: ${errors}`, HttpStatus.OK);
      }
      return response;
    } catch (error) {
      this.logger.error('Error parsing message as JSON:', error);
      throw error;
    }
  }
}

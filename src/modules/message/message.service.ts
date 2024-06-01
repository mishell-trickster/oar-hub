import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Server, WebSocket } from 'ws';

import { MessageStatus } from 'modules/gateway/constants';
import { MessageDto, RawMessageDto } from 'modules/gateway/dto/message.dto';
import { WebSocketWithKey } from 'modules/gateway/types';
import { RedisService } from 'modules/redis/redis.service';

@Injectable()
export class MessageService {
  public server: Server;
  private serverReady: Promise<void>;
  private resolveServerReady: () => void;
  private pendingResponses = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }
  >();

  constructor(private readonly redisService: RedisService) {
    this.serverReady = new Promise<void>((resolve) => {
      this.resolveServerReady = resolve;
    });
  }

  // Initialize server
  public setServer(server: Server) {
    this.server = server;
    this.resolveServerReady();
  }

  // Call specific service
  public async call(message: RawMessageDto): Promise<MessageDto> {
    await this.serverReady;
    const client = this.findServiceSocketByKey(message.apiKey);
    if (!client) {
      throw new HttpException(`Service with api Key ${message.apiKey} not found or disconnected`, HttpStatus.OK);
    }

    try {
      return await this.sendDataToClient(client, message, 5000);
    } catch (messageData) {
      const message = messageData as MessageDto;
      return message;
    }
  }

  // Call service info
  public async callInfo(apiKey: string): Promise<MessageDto> {
    return this.call({
      apiKey,
      action: 'info',
      isTask: false,
    });
  }

  public async callStatus(apiKey: string, id: string): Promise<MessageDto> {
    const message = await this.redisService.getMessage(apiKey, id);
    if (!message) {
      throw new HttpException(`Message with id ${id} not found in HUB`, HttpStatus.OK);
    }
    return message;
  }

  private async sendDataToClient(
    client: WebSocketWithKey,
    rawMessage: RawMessageDto,
    timeout: number,
  ): Promise<MessageDto> {
    // Create new message
    const message = new MessageDto();
    message.id = uuidv4();
    message.status = MessageStatus.PENDING;
    message.apiKey = rawMessage.apiKey;
    message.action = rawMessage.action;
    message.isTask = rawMessage.isTask;
    message.params = rawMessage.params;

    await this.redisService.saveMessage(client.apiKey, message);
    client.send(JSON.stringify(message));

    return new Promise<MessageDto>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingResponses.delete(message.id);

        // If timeout - reject promise with messageDto
        message.isTask = true;
        this.redisService.saveMessage(client.apiKey, message);
        reject(message);
      }, timeout);

      // On resolve - make message with response and return it
      this.pendingResponses.set(message.id, {
        resolve: (message: MessageDto) => {
          clearTimeout(timer);
          this.redisService.deleteMessage(client.apiKey, message.id);
          message.status = MessageStatus.SUCCESS;
          resolve(message);
        },
        reject: (message: MessageDto) => {
          clearTimeout(timer);
          message.status = MessageStatus.FAILED;
          reject(message);
        },
      });
    });
  }

  public async sendMessageToService(apiKey: string, message: unknown): Promise<void> {
    await this.serverReady;
    const socket = this.findServiceSocketByKey(apiKey);

    if (!socket) {
      throw new HttpException(`Service with api key ${apiKey} not found or disconnected`, HttpStatus.OK);
    }
    socket.send(JSON.stringify(message));
  }

  public resolveMessage(message: MessageDto): void {
    const response = this.pendingResponses.get(message.id);
    if (!response) {
      this.redisService.saveMessage(message.apiKey, message);
      return;
    }

    response.resolve(message);
  }

  public rejectMessage(message: MessageDto): void {
    const response = this.pendingResponses.get(message.id);
    if (!response) {
      throw new HttpException(`No pending message with ID ${message.id}`, HttpStatus.OK);
    }

    response.reject(message);
  }

  // ========================== Private methods ==========================
  private findServiceSocketByKey(apiKey: string): WebSocketWithKey | undefined {
    // find client by id
    const socket: WebSocket | undefined = [...this.server.clients].find(
      (c) => (c as unknown as WebSocketWithKey).apiKey === apiKey,
    );
    return socket ? (socket as unknown as WebSocketWithKey) : undefined;
  }
}

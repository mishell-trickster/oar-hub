import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { MessageDto } from 'modules/gateway/dto/message.dto';
import { SettingsService } from 'modules/settings/settings.service';

const DEFAULT_SESSION_TTL = 1000 * 60 * 60 * 24; // 24 hours

@Injectable()
export class RedisService {
  redis: Redis;
  public constructor(private readonly settingService: SettingsService) {
    this.init();
  }

  public async saveMessage(apiKey: string, message: MessageDto): Promise<void> {
    await this.addToSet(`message:${apiKey}`, message.id);
    await this.set(`messageData:${apiKey}:${message.id}`, message);
  }

  public async getMessageIds(apiKey: string): Promise<string[]> {
    return await this.getSet(`message:${apiKey}`);
  }

  public async getMessage(apiKey: string, messageId: string): Promise<MessageDto> {
    return await this.get(`messageData:${apiKey}:${messageId}`);
  }

  public async deleteMessage(apiKey: string, messageId: string): Promise<void> {
    this.deleteFromSet(`message:${apiKey}`, messageId);
    this.del(`messageData:${apiKey}:${messageId}`);
  }

  // ================= Standard Redis commands
  private async addToSet(key: string, id: string): Promise<void> {
    await this.redis.sadd(key, id, 'PX', DEFAULT_SESSION_TTL);
  }

  private async deleteFromSet(key: string, value: string): Promise<void> {
    await this.redis.srem(key, value);
  }

  private async getSet(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }

  private async set(key: string, value: object | string | number | null, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, JSON.stringify(value), 'PX', ttl);
      return;
    }
    await this.redis.set(key, JSON.stringify(value));
  }

  private async get<T>(key: string): Promise<T> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  private async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  private init(): void {
    const { host, port, password } = this.settingService.getSettings().redis;

    if (host === 'redis') {
      this.redis = new Redis({
        host: 'redis',
      });
    } else {
      const redisOptions = {
        url: `redis://${host}:${port}`,
        password,
      };

      if (!password) {
        delete redisOptions.password;
      }
      this.redis = new Redis(redisOptions);
    }
  }
}

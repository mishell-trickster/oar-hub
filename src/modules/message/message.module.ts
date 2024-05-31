import { Module } from '@nestjs/common';

import { RedisModule } from 'modules/redis/redis.module';

import { MessageService } from './message.service';

@Module({
  imports: [RedisModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

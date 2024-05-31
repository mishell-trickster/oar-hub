import { Module } from '@nestjs/common';

import { MessageModule } from 'modules/message/message.module';
import { RedisModule } from 'modules/redis/redis.module';
import { SettingsModule } from 'modules/settings/settings.module';

import { GatewayServer } from './gateway.server';
import { MessageHandlerService } from './message-handler.service';

@Module({
  imports: [RedisModule, MessageModule, SettingsModule],
  providers: [GatewayServer, MessageHandlerService],
})
export class GatewayModule {}

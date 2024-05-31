import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ExceptionsFilter } from 'common/errors/exceptions.filter';
import { SwaggerModule } from 'common/swagger/swagger.module';
import { GatewayModule } from 'modules/gateway/gateway.module';
import { ServicesModule } from 'modules/services/services.module';

import { MessageModule } from './modules/message/message.module';
import { RedisModule } from './modules/redis/redis.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [SwaggerModule, GatewayModule, SettingsModule, RedisModule, MessageModule, ServicesModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { SettingsModule } from 'modules/settings/settings.module';

import { RedisService } from './redis.service';

@Module({
  imports: [SettingsModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

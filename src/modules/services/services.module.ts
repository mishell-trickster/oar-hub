import { Module } from '@nestjs/common';

import { MessageModule } from 'modules/message/message.module';
import { SettingsModule } from 'modules/settings/settings.module';

import { ServicesController } from './services.controller';

@Module({
  imports: [SettingsModule, MessageModule],
  controllers: [ServicesController],
  providers: [],
  exports: [],
})
export class ServicesModule {}

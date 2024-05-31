import { Module } from '@nestjs/common';

import { OpenApiController } from './openapi.controller';
import { SwaggerService } from './swagger.service';

@Module({
  controllers: [OpenApiController],
  providers: [SwaggerService],
})
export class SwaggerModule {}

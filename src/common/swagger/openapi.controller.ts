import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { SwaggerService } from './swagger.service';

@Controller()
export class OpenApiController {
  public constructor(private readonly swaggerService: SwaggerService) {}
  @Get('openapi')
  public async getOpenApiSpec(@Res() res: Response): Promise<void> {
    if (!this.swaggerService.getDocument()) {
      await this.swaggerService.generateDocument();
    }
    res.json(this.swaggerService.getDocument());
  }
}

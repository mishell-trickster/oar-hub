import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

import { AppModule } from 'app.module';

@Injectable()
export class SwaggerService {
  private document: OpenAPIObject;

  async generateDocument(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('api')
      .build();
    this.document = SwaggerModule.createDocument(app, config);

    await app.close(); // Close the application instance
  }

  getDocument(): unknown {
    return this.document;
  }
}

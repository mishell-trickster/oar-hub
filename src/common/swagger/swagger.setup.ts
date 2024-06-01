import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SettingsIface } from 'modules/settings/types';

import { name, description, version } from '../../../package.json';

export const setupSwagger = (app: INestApplication, settings: SettingsIface): void => {
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addServer(`https://${settings.hosting.host}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve the Swagger JSON at a specific endpoint
  app.getHttpAdapter().get('/swagger-json', (_, res) => {
    res.json(document);
  });

  SwaggerModule.setup(settings.hosting.swaggerPrefix, app, document);
};

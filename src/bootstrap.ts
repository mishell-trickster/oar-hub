import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { setupSwagger } from 'common/swagger/swagger.setup';
import { SettingsService } from 'modules/settings/settings.service';

import { AppModule } from './app.module';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  const settings = app.get<SettingsService>(SettingsService).getSettings();

  app.setGlobalPrefix(settings.hosting.apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
    }),
  );
  app.enableCors({
    origin: settings.cors.origins,
    credentials: true,
  });

  setupSwagger(app, settings);

  await app.listen(settings.hosting.port, async () => {
    const appUrl = `https://${settings.hosting.host}:${settings.hosting.port}/`;
    const swaggerUrl = `https://${settings.hosting.host}:${settings.hosting.port}/${settings.hosting.swaggerPrefix}`;
    const swaggerRawUrl = `https://${settings.hosting.host}:${settings.hosting.port}/swagger-json`;

    console.info(`Application is running on: ${appUrl}`);
    console.info(`Swagger is running on: ${swaggerUrl}`);
    console.info(`Swagger JSON is available at: ${swaggerRawUrl}`);
  });
}

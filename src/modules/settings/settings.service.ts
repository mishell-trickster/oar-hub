import { Injectable } from '@nestjs/common';

import { SettingsIface } from './types';

@Injectable()
export class SettingsService {
  public constructor() {}

  public getSettings(): SettingsIface {
    const settings = {
      hosting: {
        swaggerPrefix: this.getEnv('SWAGGER_PREFIX'),
        apiPrefix: this.getEnv('API_PREFIX'),
        port: parseInt(this.getEnv('API_PORT'), 10),
        gatewayPort: parseInt(this.getEnv('API_GATEWAY_PORT'), 10),
        host: this.getEnv('API_HOST'),
      },
      cors: {
        origins: this.getEnv('CORS_ORIGINS').split(','),
      },
      redis: {
        host: this.getEnv('REDIS_HOST'),
        port: parseInt(this.getEnv('REDIS_PORT'), 10),
        password: this.getEnvOptional('REDIS_PASSWORD'),
      },
    };
    return settings;
  }

  private getEnvOptional(key: string): string | undefined {
    return process.env[key];
  }

  private getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && !defaultValue) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    if (!value && defaultValue) {
      return defaultValue;
    }
    if (value) {
      return value;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
}

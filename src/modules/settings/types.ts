export interface SettingsIface {
  hosting: {
    swaggerPrefix: string;
    apiPrefix: string;
    port: number;
    gatewayPort: number;
    host: string;
  };
  cors: {
    origins: string[];
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

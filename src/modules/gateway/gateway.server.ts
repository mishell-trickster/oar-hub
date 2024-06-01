import { Injectable, Logger } from '@nestjs/common';
import { RawData, Server } from 'ws';

import { MessageService } from 'modules/message/message.service';
import { SettingsService } from 'modules/settings/settings.service';

import { MessageHandlerService } from './message-handler.service';
import { WebSocketWithKey } from './types';

@Injectable()
export class GatewayServer {
  private readonly logger = new Logger(GatewayServer.name);
  public readonly server: Server;

  public constructor(
    private readonly settingsService: SettingsService,
    private readonly messageService: MessageService,
    private readonly messageHandlerService: MessageHandlerService,
  ) {
    const port = this.settingsService.getSettings().hosting.gatewayPort;
    this.server = new Server({ port });
    this.messageService.setServer(this.server);
    this.listen();
    this.logger.log('Websocket gateway server started');
  }

  // ============= Private methods =============
  // Start listener and attach key to socket
  private listen(): void {
    this.server.on('connection', (socket, request) => {
      // Check api key, and attach it to socket
      console.log('request.url', request.url);
      if (request.url !== '/ws/') {
        this.logger.error(`Invalid URL: ${request.url}`);
        socket.close(4000, 'Invalid URL');
        return;
      }
      const apiKey = request.headers['api-key'];
      if (!apiKey) {
        this.logger.error('No API key provided');
        // close with code and message
        socket.close(4001, 'No API key provided');
        return;
      }
      socket['apiKey'] = apiKey as string;

      // Set listeners with handlers
      socket.on('message', this.handleMessage.bind(this, socket));
      socket.on('close', this.handleClose.bind(this, socket));
    });
  }

  // Handle message from service
  private async handleMessage(socket: WebSocketWithKey, messageRaw: RawData): Promise<void> {
    this.messageHandlerService.handleMessage(socket, messageRaw);
  }

  private async handleClose(_: WebSocketWithKey): Promise<void> {
    this.logger.log('Client disconnected');
  }
}

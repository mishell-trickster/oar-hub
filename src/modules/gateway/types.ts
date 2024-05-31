import { MessageStatus } from './constants';

export interface WebSocketWithKey extends WebSocket {
  apiKey: string;
}

export interface Message {
  id: string;
  apiKey: string;
  action: string;
  isTask: boolean;
  params: object[];
  response?: unknown;
  messageStatus: MessageStatus;
}

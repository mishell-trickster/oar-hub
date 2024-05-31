import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { MessageStatus } from '../constants';

export class RawMessageDto {
  @ApiProperty({
    description: 'Api key of service where command will be executed',
    example: 'my-api-key',
  })
  @IsString()
  apiKey: string;

  @ApiProperty({
    description: 'Action to be executed on service',
    example: 'executeCommand',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description:
      'Is this message need to be executed as task in service or just a simple message with immediate response.',
    example: false,
    default: false,
  })
  @IsBoolean()
  isTask: boolean;

  @ApiProperty({
    description: 'Arguments or data for action',
    example: ['ls -l'],
  })
  @IsOptional()
  params?: Array<unknown>;
}

export class MessageDto extends RawMessageDto {
  @ApiProperty({
    description: 'UUID of message',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      'Response only exist if action was executed successfully and immediately. This field will be empty if action was executed as task and now in status pending',
    example: {
      result: 6,
    },
  })
  @IsOptional()
  response?: unknown;

  @ApiProperty({
    description:
      'Status of message. If pending then its steel running or stalled. If success then its completed successfully. If failed then its failed to execute.',
    example: 'pending',
  })
  @IsEnum(MessageStatus)
  status: MessageStatus;
}

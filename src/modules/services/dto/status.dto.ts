import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ApiKeyDto } from './api-key.dto';

export class StatusRequestDto extends ApiKeyDto {
  @ApiProperty({
    description: 'Message id',
    example: '1234-5678-1234-5678',
  })
  @IsString()
  messageId: string;
}

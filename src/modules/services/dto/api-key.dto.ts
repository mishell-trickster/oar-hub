import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApiKeyDto {
  @ApiProperty({
    description: 'Api key of service for which we want to get information',
    example: 'my-api-key',
  })
  @IsString()
  apiKey: string;
}

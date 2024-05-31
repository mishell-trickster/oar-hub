import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TaskStatusRequestDto {
  @ApiProperty({
    description: 'Api key of service for which we want to get information',
    example: 'my-api-key',
  })
  @IsString()
  apiKey: string;

  @ApiProperty({
    description: 'Id of task which was sent to service',
    example: '1234-5678-1234-5678',
  })
  @IsString()
  taskId: string;
}

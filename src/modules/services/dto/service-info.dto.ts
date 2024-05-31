import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class ServiceActionsWithParams {
  @ApiProperty({
    description: 'Name of action',
    example: 'executeCommand',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Description of action',
    example: 'Execute command inside linux terminal',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Parameters of action',
    example: ['ls -l'],
  })
  @IsObject({ each: true })
  params: unknown[];
}

export class ServiceInfoResponseDto {
  @ApiProperty({
    description: 'Name of service',
    example: 'My Own Server',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of service',
    example: 'This server can run command inside linux terminal',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Actions which can be executed on service',
    example: [
      {
        action: 'executeCommand',
        description: 'Execute command inside linux terminal',
        params: ['ls -l'],
      },
      {
        action: 'sum',
        description: 'Sum numbers',
        params: [1, 2, 3],
      },
    ],
  })
  @IsObject({ each: true })
  actions: ServiceActionsWithParams[];
}

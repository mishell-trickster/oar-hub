import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { MessageDto, RawMessageDto } from 'modules/gateway/dto/message.dto';
import { MessageService } from 'modules/message/message.service';

import { ApiKeyDto } from './dto/api-key.dto';
import { ServiceInfoResponseDto } from './dto/service-info.dto';
import { StatusRequestDto } from './dto/status.dto';

@Controller('service')
@ApiTags('service')
export class ServicesController {
  public constructor(private readonly messageService: MessageService) {}

  @Post('call')
  async call(@Body() rawMessage: RawMessageDto): Promise<MessageDto> {
    return this.messageService.call(rawMessage);
  }

  @Post('status')
  async getStatus(@Body() statusDto: StatusRequestDto): Promise<MessageDto> {
    return this.messageService.callStatus(statusDto.apiKey, statusDto.messageId);
  }

  @Post('info')
  async getServiceInfoByKey(@Body() serviceInfoRequest: ApiKeyDto): Promise<ServiceInfoResponseDto> {
    const serviceInfo = await this.messageService.callInfo(serviceInfoRequest.apiKey);
    if (!serviceInfo.response) {
      throw new HttpException('No response from service', HttpStatus.GATEWAY_TIMEOUT);
    }

    const response = plainToClass(ServiceInfoResponseDto, serviceInfo.response);
    try {
      await validateOrReject(response);
    } catch (errors) {
      throw new HttpException(
        `Validation failed, service answered with wrong format: ${errors}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return response;
  }
}

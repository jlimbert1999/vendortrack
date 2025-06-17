import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CertificateService } from '../services';
import { CreateCertificateDto } from '../dtos';
import { PaginationParamsDto } from 'src/modules/common';

@Controller('certificate')
export class CertificateController {
  constructor(private certificateService: CertificateService) {}

  @Post()
  create(@Body() body: CreateCertificateDto) {
    return this.certificateService.create(body);
  }

  @Get('history/:stall')
  getStallCertificates(@Param('stall') id: string, @Query() queryParams: PaginationParamsDto) {
    return this.certificateService.getStallCertificates(id, queryParams);
  }

  @Get('verify/:id')
  verify(@Param('id') id: string) {
    return this.certificateService.verify(id);
  }
}

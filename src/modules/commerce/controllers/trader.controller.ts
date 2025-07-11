import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { PaginationParamsDto } from 'src/modules/common';
import { CreateTraderDto, UpdateTraderDto } from '../dtos';
import { TraderService } from '../services';

@Controller('trader')
export class TraderController {
  constructor(private traderService: TraderService) {}

  @Post()
  create(@Body() body: CreateTraderDto) {
    return this.traderService.create(body);
  }

  @Get()
  findAll(@Query() queryParams: PaginationParamsDto) {
    return this.traderService.findAll(queryParams);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateTraderDto) {
    return this.traderService.update(id, body);
  }
}

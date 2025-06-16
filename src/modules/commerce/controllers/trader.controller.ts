import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TraderService } from '../services';
import { CreateTraderDto } from '../dtos';
import { PaginationParamsDto } from 'src/modules/common';

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
}

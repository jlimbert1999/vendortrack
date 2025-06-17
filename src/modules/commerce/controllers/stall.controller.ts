import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CategoryService, MarketService, StallService, TaxZoneService, TraderService } from '../services';
import { PaginationParamsDto } from 'src/modules/common';
import { CreateStallDto } from '../dtos';

@Controller('stall')
export class StallController {
  constructor(
    private stallService: StallService,
    private traderSrevice: TraderService,
    private marketService: MarketService,
    private categoryService: CategoryService,
    private taxZoneService: TaxZoneService,
  ) {}

  @Post()
  create(@Body() body: CreateStallDto) {
    return this.stallService.create(body);
  }

  @Get()
  findAll(@Query() queryParams: PaginationParamsDto) {
    return this.stallService.findAll(queryParams);
  }

  @Get('search/traders/:term')
  searcTraders(@Param('term') term: string) {
    return this.traderSrevice.search(term);
  }

  @Get('search/categories')
  searchCategories() {
    return this.categoryService.search();
  }

  @Get('search/tax-zones')
  getTaxZones() {
    return this.taxZoneService.getEnabled();
  }

  @Get('search/markets')
  searchMarkets() {
    return this.marketService.search();
  }
}

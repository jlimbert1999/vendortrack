import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CategoryService, MarketService, StallService, TaxZoneService, TraderService } from '../services';
import { PaginationParamsDto } from 'src/modules/common';
import { CreateStallDto, UpdateStallDto } from '../dtos';
import { Public } from 'src/modules/auth/decorators';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateStallDto) {
    return this.stallService.update(id, body);
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

  @Public()
  @Get('generate-stall-floor')
  generateStallFloor() {
    return this.stallService.generateStallFloor();
  }
}

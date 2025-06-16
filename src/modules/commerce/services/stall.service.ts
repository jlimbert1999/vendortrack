import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category, Market, Stall, TaxZone, Trader } from '../entities';
import { PaginationParamsDto } from 'src/modules/common';
import { CreateStallDto } from '../dtos';

interface entityRalationIds {
  traderId: string;
  categoryId: number;
  marketId: number;
  taxZoneId: number;
}
@Injectable()
export class StallService {
  constructor(
    @InjectRepository(Stall) private stallRepository: Repository<Stall>,
    @InjectRepository(Market) private marketRepository: Repository<Market>,
    @InjectRepository(Trader) private traderRepository: Repository<Trader>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(TaxZone) private taxZoneRepository: Repository<TaxZone>,
  ) {}

  async create(stallDto: CreateStallDto) {
    const { categoryId, marketId, traderId, taxZoneId, ...props } = stallDto;
    const { category, trader, market } = await this.loadRelations({ categoryId, marketId, traderId, taxZoneId });
    const entity = this.stallRepository.create({
      category,
      trader,
      market,
      ...props,
    });
    const createdStall = await this.stallRepository.save(entity);
    return createdStall;
    // return this._plainOwner(createdPet);
  }

  async findAll({ limit, offset }: PaginationParamsDto) {
    const [stalls, length] = await this.stallRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: { trader: true, category: true, market: true },
    });
    return {
      stalls,
      length,
    };
  }

  private async loadRelations({ categoryId, marketId, traderId, taxZoneId }: entityRalationIds) {
    const [market, category, trader] = await Promise.all([
      this.marketRepository.findOneBy({ id: marketId }),
      this.categoryRepository.findOneBy({ id: categoryId }),
      this.traderRepository.findOneBy({ id: traderId }),
      this.taxZoneRepository.findOneBy({ id: taxZoneId }),
    ]);
    if (!market || !category || !trader) {
      throw new NotFoundException('Invalid selected properties');
    }
    return { market, category, trader };
  }
}

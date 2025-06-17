import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category, Market, Stall, TaxZone, Trader } from '../entities';
import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
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
    @InjectRepository(TaxZone) private taxZoneRepository: Repository<TaxZone>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    private fileService: FilesService,
  ) {}

  async create(stallDto: CreateStallDto) {
    const { categoryId, marketId, traderId, taxZoneId, ...props } = stallDto;
    const { category, trader, market, taxZone } = await this.loadRelations({
      categoryId,
      marketId,
      traderId,
      taxZoneId,
    });
    const entity = this.stallRepository.create({
      category,
      trader,
      market,
      taxZone,
      ...props,
    });
    const createdStall = await this.stallRepository.save(entity);
    return this.plainStall(createdStall);
  }

  async findAll({ limit, offset }: PaginationParamsDto) {
    const [stalls, length] = await this.stallRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: { trader: true },
      order: { createdAt: 'DESC' },
    });
    return {
      stalls: stalls.map((item) => this.plainStall(item)),
      length,
    };
  }

  private async loadRelations({ categoryId, marketId, traderId, taxZoneId }: entityRalationIds) {
    const [market, category, trader, taxZone] = await Promise.all([
      this.marketRepository.findOneBy({ id: marketId }),
      this.categoryRepository.findOneBy({ id: categoryId }),
      this.traderRepository.findOneBy({ id: traderId }),
      this.taxZoneRepository.findOneBy({ id: taxZoneId }),
    ]);
    if (!market || !category || !trader || !taxZone) {
      throw new NotFoundException('Invalid selected properties');
    }
    return { market, category, trader, taxZone };
  }

  private plainStall(stall: Stall) {
    const { trader, ...props } = stall;
    return {
      ...props,
      trader: { ...trader, photo: trader.photo ? this.fileService.buildFileUrl(trader.photo, FileGroup.TRADER) : null },
    };
  }
}

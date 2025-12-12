import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, QueryFailedError, Repository } from 'typeorm';

import { Category, Certificate, Market, Stall, TaxZone, Trader } from '../entities';
import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
import { PaginationParamsDto } from 'src/modules/common';
import { CreateStallDto, UpdateStallDto } from '../dtos';

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
    @InjectRepository(Certificate) private certificateRepository: Repository<Certificate>,
    private fileService: FilesService,
  ) {}

  async create(stallDto: CreateStallDto) {
    try {
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
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && error['code'] === '23505') {
        throw new BadRequestException('Numero de puesto por piso/mercado duplicado');
      }
      throw new InternalServerErrorException('No se puedo registrar el puesto');
    }
  }

  async update(id: string, stallDto: UpdateStallDto) {
    const stall = await this.stallRepository.findOne({ where: { id }, relations: { trader: true } });

    if (!stall) {
      throw new NotFoundException('Puesto no encontrado');
    }

    const now = new Date();
    const hasActiveCertificate = await this.certificateRepository.exists({
      where: {
        stall: { id },
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });

    if (hasActiveCertificate) {
      throw new BadRequestException('No se puede editar el puesto porque tiene un certificado vigente');
    }

    const updated = await this.stallRepository.save({ ...stall, ...stallDto });
    return this.plainStall(updated);
  }

  async findAll({ limit, offset, term }: PaginationParamsDto) {
    const query = this.stallRepository
      .createQueryBuilder('stall')
      .leftJoinAndSelect('stall.trader', 'trader')
      .leftJoinAndSelect('stall.market', 'market')
      .leftJoinAndSelect('stall.category', 'category')
      .leftJoinAndSelect('stall.taxZone', 'taxZone')
      .take(limit)
      .skip(offset)
      .orderBy('stall.createdAt', 'DESC');

    if (term) {
      const isNumeric = !isNaN(+term);
      if (isNumeric) {
        query.andWhere('stall.number = :number', { number: +term });
      } else {
        const lowerTerm = `%${term.toLowerCase()}%`;
        query.where(
          `CONCAT(trader.firstName, ' ', trader.lastNamePaternal, ' ', trader.lastNameMaternal) ILIKE :search`,
          {
            search: `%${lowerTerm}%`,
          },
        );
      }
    }
    const [stalls, length] = await query.getManyAndCount();
    return {
      stalls: stalls.map((item) => this.plainStall(item)),
      length,
    };
  }

  async generateStallFloor() {
    const stalls = await this.stallRepository.find({});
    for (const stall of stalls) {
      if (!stall.location) {
        continue;
      }

      const match = stall.location.match(/\d+/);

      if (!match) {
        console.warn(`No se pudo extraer piso del stall ${stall.id} (location="${stall.location}")`);
        continue;
      }
      const floor = Number(match[0]);
      await this.stallRepository.update(stall.id, {
        floor,
      });
    }
    return { message: 'Update completed' };
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

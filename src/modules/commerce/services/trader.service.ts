import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, QueryFailedError, Repository } from 'typeorm';

import { CreateTraderDto, UpdateTraderDto } from '../dtos';
import { Certificate, Trader } from '../entities';
import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
import { PaginationParamsDto } from 'src/modules/common';

@Injectable()
export class TraderService {
  constructor(
    private fileService: FilesService,
    @InjectRepository(Trader) private traderRepository: Repository<Trader>,
    @InjectRepository(Certificate) private certificateRepository: Repository<Certificate>,
  ) {}

  async create(traderDto: CreateTraderDto) {
    try {
      const entity = this.traderRepository.create(traderDto);
      const createdTrader = await this.traderRepository.save(entity);
      return this.plainTrader(createdTrader);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError['code'] === '23505') {
        throw new ConflictException(`El numero ${traderDto.dni} ya esta registrado`);
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, traderDto: UpdateTraderDto) {
    const trader = await this.traderRepository.findOne({ where: { id } });
    const { photo, ...toUpdate } = traderDto;

    if (!trader) {
      throw new NotFoundException('Comerciante no encontrado');
    }

    const now = new Date();
    const hasActiveCertificate = await this.certificateRepository.exists({
      where: {
        trader: { id },
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });

    if (hasActiveCertificate) {
      throw new BadRequestException('No se puede editar el comerciante porque tiene un certificado vigente');
    }

    if (photo !== undefined && trader.photo) {
      // * Image = null, is remove image
      const imageChangedOrRemoved = photo === null || photo !== trader.photo;
      if (imageChangedOrRemoved) {
        await this.fileService.remove(trader.photo, FileGroup.TRADER);
      }
    }

    const updated = await this.traderRepository.save({ id: trader.id, photo, ...toUpdate });
    return this.plainTrader(updated);
  }

  async findAll({ limit, offset }: PaginationParamsDto) {
    const [traders, length] = await this.traderRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return {
      traders: traders.map((trader) => this.plainTrader(trader)),
      length,
    };
  }

  private plainTrader(trader: Trader) {
    const { photo, ...props } = trader;
    return {
      photo: photo ? this.fileService.buildFileUrl(photo, FileGroup.TRADER) : null,
      ...props,
    };
  }

  async search(term: string) {
    const search = `%${term.trim()}%`;
    return await this.traderRepository
      .createQueryBuilder('trader')
      .where(`CONCAT(trader.firstName, ' ', trader.lastNamePaternal, ' ', trader.lastNameMaternal) ILIKE :search`, {
        search,
      })
      .orWhere('trader.dni ILIKE :dni', { dni: `%${term}%` })
      .getMany();
  }
}

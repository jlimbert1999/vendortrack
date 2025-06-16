import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTraderDto } from '../dtos';
import { Trader } from '../entities';
import { FilesService } from 'src/modules/files/files.service';
import { FileGroup } from 'src/modules/files/file-group.enum';
import { PaginationParamsDto } from 'src/modules/common';

@Injectable()
export class TraderService {
  constructor(
    private fileService: FilesService,
    @InjectRepository(Trader) private traderRepository: Repository<Trader>,
  ) {}

  async create(traderDto: CreateTraderDto) {
    try {
      const entity = this.traderRepository.create(traderDto);
      const createdTrader = await this.traderRepository.save(entity);
      return this.plainTrader(createdTrader);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll({ limit, offset }: PaginationParamsDto) {
    const [traders, length] = await this.traderRepository.findAndCount({
      take: limit,
      skip: offset,
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

  async search(term?: string) {
    return await this.traderRepository.find({});
  }
}

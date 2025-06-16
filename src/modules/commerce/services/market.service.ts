import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Market } from '../entities';

@Injectable()
export class MarketService {
  constructor(@InjectRepository(Market) private marketRepository: Repository<Market>) {}

  async search(term?: string) {
    return await this.marketRepository.find({});
  }
}

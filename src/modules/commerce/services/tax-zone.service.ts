import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxZone } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class TaxZoneService {
  constructor(@InjectRepository(TaxZone) private taxZoneRepository: Repository<TaxZone>) {}

  async getEnabled() {
    return await this.taxZoneRepository.find({});
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Certificate, Stall } from '../entities';
import { CreateCertificateDto } from '../dtos';
import { PaginationParamsDto } from 'src/modules/common';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate) private certificateRepository: Repository<Certificate>,
    @InjectRepository(Stall) private stallRepository: Repository<Stall>,
  ) {}

  async getStallCertificates(stallId: string, { limit, offset }: PaginationParamsDto) {
    return await this.certificateRepository.find({
      where: { stall: { id: stallId } },
      relations: { stall: { category: true, market: true, taxZonce: true }, trader: true },
      skip: offset,
      take: limit,
    });
  }

  async create(data: CreateCertificateDto) {
    const { code, paymentMethod, stallId } = data;

    await this.ensureUniqueCode(code);

    const stall = await this.stallRepository.findOne({
      where: { id: stallId },
      relations: { trader: true, category: true, market: true },
      select: { category: { name: true }, market: { name: true } },
    });

    if (!stall) throw new NotFoundException(`Puesto ${stallId} no encontrado`);

    await this.ensureNoActiveCertificate(stall.id);

    if (!stall.trader) throw new BadRequestException(`El puesto seleccionado no tiene asignacion`);

    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 2);

    const certificate = this.certificateRepository.create({
      code,
      paymentMethod,
      trader: stall.trader,
      stall: stall,
      startDate: now,
      endDate: oneYearLater,
    });
    return await this.certificateRepository.save(certificate);
  }

  private async ensureUniqueCode(code: number) {
    const duplicate = await this.certificateRepository.findOne({ where: { code } });
    if (duplicate) throw new BadRequestException(`Codigo ${code} ya existe`);
  }

  private async ensureNoActiveCertificate(stallId: string) {
    const now = new Date();
    const existing = await this.certificateRepository.findOne({
      where: {
        stall: { id: stallId },
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });
    if (existing) {
      throw new BadRequestException('Ya existe un certificado emitido para este puesto');
    }
  }
}

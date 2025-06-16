import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService, CertificateService, MarketService, StallService, TraderService } from './services';
import { CertificateController, StallController, TraderController } from './controllers';
import { Category, Certificate, Market, Stall, TaxZone, Trader } from './entities';
import { FilesModule } from '../files/files.module';
import { TaxZoneService } from './services/tax-zone.service';

@Module({
  providers: [TraderService, StallService, CategoryService, MarketService, CertificateService, TaxZoneService],
  imports: [TypeOrmModule.forFeature([Certificate, Category, TaxZone, Trader, Market, Stall]), FilesModule],
  controllers: [TraderController, StallController, CertificateController],
})
export class CommerceModule {}

import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConditionalModule, ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConditionalModule, ConfigModule],
  exports: [FilesService],
})
export class FilesModule {}

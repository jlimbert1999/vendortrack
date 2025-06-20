import { Controller, Get, Param, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { CustomUploadFileTypeValidator } from './validators/upload-file-type.validator';
import { GetFileDto } from './dtos/get-file.dto';
import { FilesService } from './files.service';
import { FileGroup } from './file-group.enum';
import { Public } from '../auth/decorators';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('trader')
  @UseInterceptors(FileInterceptor('file'))
  uploadTradePhoto(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(new CustomUploadFileTypeValidator(['png', 'jpg', 'jpeg']))
        .addMaxSizeValidator({ maxSize: 5 * 1000000 })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.saveFile(file, FileGroup.TRADER);
  }

  @Public()
  @Get(':group/:fileName')
  getFile(@Res() res: Response, @Param() requestParams: GetFileDto) {
    const path = this.filesService.getStaticFilePath(requestParams);
    res.sendFile(path);
  }
}

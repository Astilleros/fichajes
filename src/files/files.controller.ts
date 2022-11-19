import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const file = await this.filesService.findById(id);
    if (!file) return;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });
    return res.send(file.data);
  }
}

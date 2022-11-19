import {
  Controller,
  Get,
  Header,
  Param,
  UseGuards,
  Response,
} from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  @Header('Content-Type', 'application/pdf')
  //@Header('Content-Disposition', 'attachment; filename="package.pdf"')
  async findOne(@Response() res: any, @Param('id') id: string) {
    const file = await this.filesService.findById(id);
    if (!file) return;
    res.set({
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });
    return file.data;
  }
}

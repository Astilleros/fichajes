import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="package.pdf"')
  async findOne(@Param('id') id: string) {
    const file = await this.filesService.findById(id);
    if (!file) return;
    return file.data;
  }
}

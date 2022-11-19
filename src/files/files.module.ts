import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Files, FilesSchema } from './entities/files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Files.name, schema: FilesSchema }]),
  ],
  controllers: [],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}

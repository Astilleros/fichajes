import { Module } from '@nestjs/common';
import { SignService } from './sign.service';
import { SignController } from './sign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sign, SignSchema } from './entities/sign.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sign.name, schema: SignSchema }]),
  ],
  controllers: [SignController],
  providers: [SignService],
  exports: [SignService],
})
export class SignModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutsService } from './checkouts.service';
import { Checkout, CheckoutSchema } from './entities/checkout.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Checkout.name,
        schema: CheckoutSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [CheckoutsService],
  exports: [CheckoutsService],
})
export class CheckoutsModule {}

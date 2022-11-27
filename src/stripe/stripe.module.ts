import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { CheckoutsModule } from './checkouts/checkouts.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
  imports: [CheckoutsModule]
})
export class StripeModule {}

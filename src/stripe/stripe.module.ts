import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
  imports: [CheckoutsModule, UserModule],
})
export class StripeModule {}

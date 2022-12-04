import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CheckoutsModule, UserModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}

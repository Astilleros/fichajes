import { Controller, Get, Post, Request } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/AuthUser.decorator';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get()
  list(@AuthUser() user: JwtPayload) {
    return this.stripeService.listCheckouts(user);
  }

  @Post()
  create(@AuthUser() user: JwtPayload) {
    return this.stripeService.createCheckout(user);
  }

  @Post('webhook')
  webhook(@Request() request: Request) {
    return this.stripeService.webhook(
      request.headers['stripe-signature'],
      request.body,
    );
  }
}

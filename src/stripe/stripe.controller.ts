import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/AuthUser.decorator';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StripeService } from './stripe.service';

@Controller('stripe')
@UseGuards(JwtAuthGuard)
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
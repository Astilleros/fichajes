import {
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/AuthUser.decorator';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import MongooseClassSerializerInterceptor from 'src/core/interceptors/MongooseClassSerializer.interceptor';
import { Checkout } from './checkouts/entities/checkout.entity';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(Checkout))
  list(@AuthUser() user: JwtPayload): Promise<Checkout[]> {
    return this.stripeService.listCheckouts(user);
  }

  // TO DO FALTAN REMOVE
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(Checkout))
  create(@AuthUser() user: JwtPayload) {
    return this.stripeService.createCheckout(user);
  }

  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>) {
    return this.stripeService.webhook(
      req.headers['stripe-signature'],
      req.rawBody,
    );
  }
}

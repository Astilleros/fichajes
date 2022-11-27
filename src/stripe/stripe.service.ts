import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import Stripe from 'stripe';
import { CheckoutsService } from './checkouts/checkouts.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhook_secret: string;

  constructor(
    private cfg: ConfigService,
    private CheckoutsService: CheckoutsService,
  ) {
    console.log(cfg.get('STRIPE_SECRET_KEY'));
    this.webhook_secret = cfg.get('STRIPE_WEBHOOK_SECRET');
    this.stripe = new Stripe(cfg.get('STRIPE_SECRET_KEY'), {
      apiVersion: cfg.get('STRIPE_API_VERSION'),
    });
  }

  async createCheckout(user: JwtPayload) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: this.cfg.get('PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.cfg.get('DOMAIN'),
      cancel_url: this.cfg.get('DOMAIN'),
      automatic_tax: { enabled: true },
    });

    return await this.CheckoutsService.create({
      checkout: session,
      user: user._id,
    });
  }

  async listCheckouts(user: JwtPayload) {
    return await this.CheckoutsService.findAll(user._id);
  }

  async webhook(sig: string, body: any) {
    const event = this.stripe.webhooks.constructEvent(
      body,
      sig,
      this.webhook_secret,
    );
    console.log(event);

    // Handle the event
    const session: any = event?.data?.object;
    if (!session) throw new Error('No paymentIntent.');

    const checkout_db = await this.CheckoutsService.findOne(session.id);
    if (!checkout_db) return;

    checkout_db.status = event.type.split('.')[2];
    console.log(checkout_db);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.createOrder(session);
        if (session.payment_status === 'paid') await this.fulfillOrder(session);
        break;
      case 'checkout.session.async_payment_succeeded':
        await this.fulfillOrder(session);
        break;
      case 'checkout.session.expired':
        await this.emailCustomerAboutFailedPayment(session);
        break;
      case 'checkout.session.async_payment_failed':
        await this.emailCustomerAboutFailedPayment(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    await checkout_db.save();
  }

  async createOrder(session: Stripe.Checkout.Session) {
    // TODO: COMPLETADO PROCESO POR USUARIO
    console.log('Creating order', session);
  }

  async fulfillOrder(session: Stripe.Checkout.Session) {
    // TODO: PAGO RECIBIDO DEFINITIVO
    console.log('Fulfilling order', session);
  }

  async emailCustomerAboutFailedPayment(session: Stripe.Checkout.Session) {
    // TODO: SESSION CANCELADA
    console.log('Emailing customer', session);
  }
}

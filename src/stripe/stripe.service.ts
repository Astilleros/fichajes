import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { CheckoutsService } from './checkouts/checkouts.service';
import { CheckoutDocument } from './checkouts/entities/checkout.entity';
import { CheckoutStatus } from './checkouts/entities/status.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhook_secret: string;

  constructor(
    private cfg: ConfigService,
    private CheckoutsService: CheckoutsService,
    private UserService: UserService,
  ) {
    console.log(cfg.get('STRIPE_SECRET_KEY'));
    this.webhook_secret = cfg.get('STRIPE_WEBHOOK_SECRET');
    this.stripe = new Stripe(cfg.get('STRIPE_SECRET_KEY'), {
      apiVersion: cfg.get('STRIPE_API_VERSION'),
    });
  }

  async createCheckout(user: JwtPayload) {
    const activeOld = await this.CheckoutsService.findAll

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: this.cfg.get('PRICE'),
          quantity: 1,
        },
      ],
      mode: 'payment',
      /* payment_method_types: [this.cfg.get('PAYMENT_METHOD_TYPES')], */
      success_url: this.cfg.get('DOMAIN'),
      cancel_url: this.cfg.get('DOMAIN'),
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

    switch (event.type) {
      case 'checkout.session.completed':
        await this.createOrder(session, checkout_db);
        checkout_db.status = CheckoutStatus.pending;
        if (session.payment_status === 'paid') {
          await this.fulfillOrder(session, checkout_db);
          checkout_db.status = CheckoutStatus.completed;
        }
        break;
      case 'checkout.session.async_payment_succeeded':
        await this.fulfillOrder(session, checkout_db);
        checkout_db.status = CheckoutStatus.completed;
        break;
      case 'checkout.session.expired':
        await this.emailCustomerAboutFailedPayment(session, checkout_db);
        checkout_db.status = CheckoutStatus.failure;
        break;
      case 'checkout.session.async_payment_failed':
        await this.emailCustomerAboutFailedPayment(session, checkout_db);
        checkout_db.status = CheckoutStatus.failure;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        return;
    }
    await checkout_db.save();
  }

  async createOrder(
    session: Stripe.Checkout.Session,
    checkout_db: CheckoutDocument,
  ) {
    // EMAIL DE COMPLETA LA COMPRA PAGANDO
    console.log('Creating order', session);
  }

  async fulfillOrder(
    session: Stripe.Checkout.Session,
    checkout_db: CheckoutDocument,
  ) {
    console.log('Fulfilling order', session);
    // EMAIL DE PAGO RECIBIDO
    // SUMAR 1 año A LA SUBSCRIPCION
    const user = await this.UserService.findOne(checkout_db.user);
    if (!user.licensedUntil) {
      user.licensedUntil = new Date();
    }
    const until = new Date(user.licensedUntil);
    until.setFullYear(until.getFullYear() + 1);
    user.licensedUntil = until;
    await user.save();
  }

  async emailCustomerAboutFailedPayment(
    session: Stripe.Checkout.Session,
    checkout_db: CheckoutDocument,
  ) {
    // TODO: SESSION CANCELADA
    console.log('Emailing customer', session);
  }
}

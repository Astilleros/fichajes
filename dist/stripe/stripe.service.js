"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const checkouts_service_1 = require("./checkouts/checkouts.service");
let StripeService = class StripeService {
    constructor(cfg, CheckoutsService) {
        this.cfg = cfg;
        this.CheckoutsService = CheckoutsService;
        console.log(cfg.get('STRIPE_SECRET_KEY'));
        this.webhook_secret = cfg.get('STRIPE_WEBHOOK_SECRET');
        this.stripe = new stripe_1.default(cfg.get('STRIPE_SECRET_KEY'), {
            apiVersion: cfg.get('STRIPE_API_VERSION'),
        });
    }
    async createCheckout(user) {
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
    async listCheckouts(user) {
        return await this.CheckoutsService.findAll(user._id);
    }
    async webhook(sig, body) {
        var _a;
        const event = this.stripe.webhooks.constructEvent(body, sig, this.webhook_secret);
        console.log(event);
        const session = (_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.object;
        if (!session)
            throw new Error('No paymentIntent.');
        const checkout_db = await this.CheckoutsService.findOne(session.id);
        if (!checkout_db)
            return;
        checkout_db.status = event.type.split('.')[2];
        console.log(checkout_db);
        switch (event.type) {
            case 'checkout.session.completed':
                await this.createOrder(session);
                if (session.payment_status === 'paid')
                    await this.fulfillOrder(session);
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
    async createOrder(session) {
        console.log('Creating order', session);
    }
    async fulfillOrder(session) {
        console.log('Fulfilling order', session);
    }
    async emailCustomerAboutFailedPayment(session) {
        console.log('Emailing customer', session);
    }
};
StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        checkouts_service_1.CheckoutsService])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map
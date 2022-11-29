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
const user_service_1 = require("../user/user.service");
const stripe_1 = require("stripe");
const checkouts_service_1 = require("./checkouts/checkouts.service");
const status_enum_1 = require("./checkouts/entities/status.enum");
let StripeService = class StripeService {
    constructor(cfg, CheckoutsService, UserService) {
        this.cfg = cfg;
        this.CheckoutsService = CheckoutsService;
        this.UserService = UserService;
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
                    price: this.cfg.get('PRICE'),
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_method_types: this.cfg.get('PAYMENT_METHOD_TYPES'),
            success_url: this.cfg.get('DOMAIN'),
            cancel_url: this.cfg.get('DOMAIN'),
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
        switch (event.type) {
            case 'checkout.session.completed':
                await this.createOrder(session, checkout_db);
                checkout_db.status = status_enum_1.CheckoutStatus.pending;
                if (session.payment_status === 'paid') {
                    await this.fulfillOrder(session, checkout_db);
                    checkout_db.status = status_enum_1.CheckoutStatus.completed;
                }
                break;
            case 'checkout.session.async_payment_succeeded':
                await this.fulfillOrder(session, checkout_db);
                checkout_db.status = status_enum_1.CheckoutStatus.completed;
                break;
            case 'checkout.session.expired':
                await this.emailCustomerAboutFailedPayment(session, checkout_db);
                checkout_db.status = status_enum_1.CheckoutStatus.failure;
                break;
            case 'checkout.session.async_payment_failed':
                await this.emailCustomerAboutFailedPayment(session, checkout_db);
                checkout_db.status = status_enum_1.CheckoutStatus.failure;
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
                return;
        }
        await checkout_db.save();
    }
    async createOrder(session, checkout_db) {
        console.log('Creating order', session);
    }
    async fulfillOrder(session, checkout_db) {
        console.log('Fulfilling order', session);
        const user = await this.UserService.findOne(checkout_db.user);
        if (!user.licensedUntil) {
            user.licensedUntil = new Date();
        }
        const until = new Date(user.licensedUntil);
        until.setFullYear(until.getFullYear() + 1);
        user.licensedUntil = until;
        await user.save();
    }
    async emailCustomerAboutFailedPayment(session, checkout_db) {
        console.log('Emailing customer', session);
    }
};
StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        checkouts_service_1.CheckoutsService,
        user_service_1.UserService])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map
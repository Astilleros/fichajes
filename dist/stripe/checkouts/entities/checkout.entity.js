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
exports.CheckoutSchema = exports.Checkout = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const stripe_1 = require("stripe");
const status_enum_1 = require("./status.enum");
let Checkout = class Checkout {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Checkout.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Date)
], Checkout.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Checkout.prototype, "checkout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: status_enum_1.CheckoutStatus, default: status_enum_1.CheckoutStatus.pristine }),
    __metadata("design:type", Number)
], Checkout.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Checkout.prototype, "confirmedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Checkout.prototype, "cacelledAt", void 0);
Checkout = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
    })
], Checkout);
exports.Checkout = Checkout;
exports.CheckoutSchema = mongoose_1.SchemaFactory.createForClass(Checkout);
//# sourceMappingURL=checkout.entity.js.map
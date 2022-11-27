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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const checkout_entity_1 = require("./entities/checkout.entity");
let CheckoutsService = class CheckoutsService {
    constructor(CheckoutModel) {
        this.CheckoutModel = CheckoutModel;
    }
    async create(createCheckoutDto) {
        const checkout = await this.CheckoutModel.create(createCheckoutDto);
        return checkout;
    }
    async findOne(session_id) {
        const checkout = await this.CheckoutModel.findOne({
            'createdRawData.id': session_id,
        });
        return checkout;
    }
    async findAll(user_id) {
        const checkouts = await this.CheckoutModel.find({ user: user_id });
        return checkouts;
    }
    async update(_id, updateCheckoutDto) {
        const checkout = await this.CheckoutModel.findOneAndUpdate({ _id }, updateCheckoutDto, { new: true, runValidators: true });
        return checkout;
    }
    async remove(_id) {
        return await this.CheckoutModel.deleteOne({ _id });
    }
};
CheckoutsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(checkout_entity_1.Checkout.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CheckoutsService);
exports.CheckoutsService = CheckoutsService;
//# sourceMappingURL=checkouts.service.js.map
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { Checkout, CheckoutDocument } from './entities/checkout.entity';
import { CheckoutStatus } from './entities/status.enum';

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectModel(Checkout.name)
    private readonly CheckoutModel: Model<CheckoutDocument>,
  ) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    const checkout = await this.CheckoutModel.create(createCheckoutDto);
    return checkout;
  }

  async findOne(session_id: Types.ObjectId) {
    const checkout = await this.CheckoutModel.findOne({
      'checkout.id': session_id,
    });
    return checkout;
  }

  async findAll(user_id: Types.ObjectId) {
    const checkouts = await this.CheckoutModel.find({ user: user_id });
    return checkouts;
  }

  async update(_id: Types.ObjectId, updateCheckoutDto: UpdateCheckoutDto) {
    const checkout = await this.CheckoutModel.findOneAndUpdate(
      { _id },
      updateCheckoutDto,
      { new: true, runValidators: true },
    );
    return checkout;
  }

  async remove(_id: Types.ObjectId) {
    return await this.CheckoutModel.deleteOne({
      _id,
      status: { $ne: CheckoutStatus.completed },
    });
  }
}

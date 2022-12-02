import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async findOne(session_id: string) {
    const checkout = await this.CheckoutModel.findOne({
      'checkout.id': session_id,
    });
    return checkout;
  }

  async findAll(user_id: string) {
    const checkouts = await this.CheckoutModel.find({ user: user_id });
    return checkouts;
  }

  async update(_id: string, updateCheckoutDto: UpdateCheckoutDto) {
    const checkout = await this.CheckoutModel.findOneAndUpdate(
      { _id },
      updateCheckoutDto,
      { new: true, runValidators: true },
    );
    return checkout;
  }

  async remove(_id: string) {
    return await this.CheckoutModel.deleteOne({
      _id,
      status: { $ne: CheckoutStatus.completed },
    });
  }
}

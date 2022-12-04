export class CreateCheckoutDto {
  user: string;

  checkout: any;

  createdAt?: Date;

  confirmedAt?: Date;

  cacelledAt?: Date;
}

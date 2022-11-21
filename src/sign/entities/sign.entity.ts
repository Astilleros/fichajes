import { Prop } from "@nestjs/mongoose";

export class Sign {
@Prop()
readonly user: string;

@Prop()
readonly file: string;

@Prop()
readonly month: string;

@Prop()
readonly createdAt: string;

}

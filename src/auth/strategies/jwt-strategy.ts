import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../dto/jwtPayload.dto';
import { User } from 'src/user/entities/user.entity';
import { Types } from 'mongoose';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'asdfasdf"·$"%&&gdfgs65656$·$"%&//HfsfdghdfghJWT_SECRET1234551234455123455',
    });
  }

  async validate(user: User): Promise<JwtPayload> {
    return {
      _id: new Types.ObjectId(user._id),
      username: user.username,
      email: user.email,
    };
  }
}

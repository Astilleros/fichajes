import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../dto/jwtPayload.dto';

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

  async validate(user: any): Promise<JwtPayload> {
    return { _id: user._id, username: user.username, email: user.email };
  }
}

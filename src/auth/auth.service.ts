import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncriptService } from 'src/encript/encript.service';
import { UserDocument } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private encrip: EncriptService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUsername(username);
    if (!user) return null;
    const valid = await this.encrip.comparePasswords(pass, user.password);
    if (!valid) return null;
    return user;
  }

  async generateAccessToken(user: UserDocument) {
    const payload = {
      username: user.username,
      _id: user._id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

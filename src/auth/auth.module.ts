import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { EncriptService } from 'src/encript/encript.service';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret:
        'asdfasdf"·$"%&&gdfgs65656$·$"%&//HfsfdghdfghJWT_SECRET1234551234455123455',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    UserService,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    EncriptService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

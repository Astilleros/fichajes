import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/decorators/AuthUser.decorator';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  profile(@AuthUser() user: JwtPayload): Promise<User> {
    return this.userService.findOne(user._id);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  update(
    @AuthUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(user._id, updateUserDto);
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  remove(@AuthUser() user: JwtPayload): Promise<User> {
    return this.userService.remove(user._id);
  }
}

import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { UserService } from '..//user/user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('available')
  async usernameAvalaible(@Query('username') username: string ) {
    const available = await this.userService.findByUsername(username);
    return { available: !available };
  }

  @Put()
  async update(
    @CurrentUser() currentUser: UserDocument,
    @Body('user') updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(currentUser, updateUserDto);
    return { user };
  }
}

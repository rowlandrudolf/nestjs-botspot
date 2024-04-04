import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterDto } from '../shared/dto/register.dto';
import { LoginDto } from '../shared/dto/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from '../user/user.schema';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body('user') registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return { user: this.authService.userResponse(user) };
  }

  @Post('login')
  async login(@Body('user') loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    return { user: this.authService.userResponse(user) };
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@CurrentUser() currentUser: UserDocument) {
    return { user: this.authService.userResponse(currentUser) };
  }
}

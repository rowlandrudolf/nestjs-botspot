import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { RegisterDto } from '@app/shared/dto/register.dto';
import { LoginDto } from '@app/shared/dto/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User, UserDocument } from '@app/user/user.schema';
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

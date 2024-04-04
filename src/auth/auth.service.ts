import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from '../shared/dto/register.dto';
import { User, UserDocument, UserResponseType } from '../user/user.schema';
import { LoginDto } from '../shared/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto){
    const user = await this.userService.createUser(registerDto);
    user.password = undefined;
    return user;
  }

  async login(loginDto: LoginDto){
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException();
    user.password = undefined;
    return user;
  }

  userResponse(user: UserDocument): UserResponseType {
    return {
      ...user.toObject(),
      token: this.generateJWT(user),
    };
  }

  private generateJWT(user: User): string {
    const { _id, email, username } = user;
    return sign({ _id, email, username }, this.configService.get('JWT_SECRET'));
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email, {
      email: 1,
      password: 1,
      username: 1,
    });
    if (!user) throw new NotFoundException('Invalid Email');
    const isValidPassword = await this.verifyPassword(password, user.password);
    return isValidPassword ? user : null;
  }
}

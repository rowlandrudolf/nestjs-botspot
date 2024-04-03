import { UserService } from '@app/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request & { user? }, _: Response, next: NextFunction){
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, this.configService.get('JWT_SECRET'));
      const user = await this.userService.findById(decoded._id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}

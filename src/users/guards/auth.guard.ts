import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../utils/types';
import { CURRENT_USER } from '../../utils/constants';
import { UsersService } from '../users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type != 'Bearer' || !token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const user = await this.usersService.getCurrentUser(payload.id);
      if (!user) throw new UnauthorizedException('User not found');
      request[CURRENT_USER] = user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}

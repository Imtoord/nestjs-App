// import {
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
//   Injectable,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { JwtPayload } from 'src/utils/types';
// import { UsersService } from '../../users/users.service';
// import { UserType } from 'src/utils/enum';
// import { Reflector } from '@nestjs/core';
// import { CURRENT_USER } from 'src/utils/constants';

// @Injectable()
// export class AuthRolesGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//     private readonly usersService: UsersService,
//     private readonly reflector: Reflector,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     //get roles metadata
//     const roles = this.reflector.getAllAndOverride<UserType[]>('roles', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!roles || roles.length === 0) {
//       throw new UnauthorizedException('access denied: no roles defined');
//     }

//     const request: Request = context.switchToHttp().getRequest();
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     if (type != 'Bearer' || !token) {
//       throw new UnauthorizedException('No token provided');
//     }
//     try {
//       const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
//         secret: this.configService.get<string>('JWT_SECRET'),
//       });
//       const user = await this.usersService.getCurrentUser(payload.id);
//       if (!user) throw new UnauthorizedException('User not found');
//       if (!roles.includes(user.userType))
//         throw new UnauthorizedException(
//           'Access denied: insufficient permissions',
//         );

//       request[CURRENT_USER] = payload;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid or expired token 000');
//     }

//     return true;
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/utils/types';
import { UsersService } from '../../users/users.service';
import { UserType } from 'src/utils/enum';
import { Reflector } from '@nestjs/core';
import { CURRENT_USER } from 'src/utils/constants';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      throw new UnauthorizedException('access denied: no roles defined');
    }
  
    const request: Request = context.switchToHttp().getRequest();
    const user = request[CURRENT_USER];
    
    if (roles.includes(user.userType) === false) {
      throw new UnauthorizedException(
        'Access denied: insufficient permissions',
      );
    }

    return true;
  }
}

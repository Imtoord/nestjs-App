import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/utils/enum';

export const Roles = 
(...roles: UserType[]) => SetMetadata('roles', roles);

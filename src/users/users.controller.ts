import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dtos/register.dtos';
import { LoginUserDto } from './dtos/login.dtos';
import { HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from 'src/utils/types';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UpdateUserDto } from './dtos/update-user.tdo';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth/register')
  registerUser(@Body() userData: RegisterUserDto) {
    return this.usersService.registerUser(userData);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() userData: LoginUserDto) {
    return this.usersService.loginUser(userData);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() currentUser: JwtPayload) {
    return this.usersService.getCurrentUser(currentUser.id);
  }

  @Put('update-user')
  @UseGuards(AuthGuard)
  updateUser(
    @CurrentUser() currentUser: JwtPayload,
    @Body() userData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(currentUser.id, userData);
  }

  @Delete('delete-account')
  @UseGuards(AuthGuard)
  deleteCurrentUser(@CurrentUser() currentUser: JwtPayload) {
    return this.usersService.deleteUserById(currentUser.id);
  }

  @Get('all-users')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Delete('delete-all-users')
  @UseGuards(AuthGuard)
  deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }

  @Put('update-user/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  updateUserByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, userData);
  }

  @Delete('delete-user/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserById(id);
  }
}

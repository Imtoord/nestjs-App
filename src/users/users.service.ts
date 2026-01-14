import {
  BadRequestException,
  Injectable,
  Ip,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dtos/register.dtos';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login.dtos';
import { JwtPayload } from 'src/utils/types';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/update-user.tdo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({
    username,
    email,
    password,
  }: RegisterUserDto): Promise<{ accessToken: string }> {
    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    const user = await this.userRepository.save(newUser);
    const accessToken = await this.generateJwtToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken };
  }

  async loginUser({
    email,
    password,
  }: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User or password is incorrect');
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid)
      throw new NotFoundException('User or password is incorrect');

    const accessToken = await this.generateJwtToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken };
  }

  async updateUser(id: number, updateData: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    await this.userRepository.update(id, { ...user, ...updateData });
    return await this.userRepository.findOneBy({ id });
  }

  async getCurrentUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async getUsers() {
    return await this.userRepository.find();
  }

    async deleteAllUsers() {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute();

    return { message: 'All users deleted' };
  }

  private async generateJwtToken(jwtPayload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(jwtPayload);
  }
}

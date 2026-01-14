import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

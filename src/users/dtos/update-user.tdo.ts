import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  @IsString()
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  @IsOptional()
  password: string;
}

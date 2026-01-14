import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class createProductTdo {
  @IsString()
  @IsNotEmpty()
  @Length(3, 300)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: ' price should not be lesss then 0' })
  price: number;
}

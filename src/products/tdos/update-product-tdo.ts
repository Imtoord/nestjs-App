import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  MinLength,
  minLength,
} from 'class-validator';

export class updateProductTdo {
  @IsString()
  @Length(3, 300)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsNumber()
  @Min(0, { message: ' price should not be lesss then 0' })
  price: number;
}

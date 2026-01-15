import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JwtPayload } from 'src/utils/types';
import { User } from 'src/users/entity/user.entity';
import { CreateReviewDto } from './dtos/create-review.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('')
  getReviews() {
    return this.reviewsService.getReviews();
  }

  @Get(':id')
  getReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getReview(id);
  }

  @Post('product/:productId')
  @Roles(UserType.ADMIN, UserType.CUSTOMER)
  @UseGuards(AuthGuard)
  addReview(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: User,
    @Body() review: CreateReviewDto,
  ) {
    return this.reviewsService.addReview(review, user, productId);
  }

  @Put(':id')
  @Roles(UserType.ADMIN, UserType.CUSTOMER)
  @UseGuards(AuthGuard)
  updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() review: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, review);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.deleteReview(id);
  }
}

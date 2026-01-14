import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { JwtPayload } from 'src/utils/types';
import { User } from 'src/users/entity/user.entity';
import { Review } from './review.entity/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/prodect.entity/product.entity';
import { ProductsService } from 'src/products/products.server';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
    private readonly productsService: ProductsService,
  ) {}
  getReviews() {
    return this.reviewsRepo;
  }

  getReview(id: number) {
    const review = this.reviewsRepo.findOneBy({ id });

    if (!review) {
      throw new Error('Review not found');
    }

    return review;
  }

  async addReview(review: CreateReviewDto, user: User, productId: number) {
    const product = await this.productsService.getProduct(productId);

    if (!product) {
      throw new Error('Product not found');
    }
    const newReview = this.reviewsRepo.create({
      ...review,
      user,
      product,
    });
    return this.reviewsRepo.save(newReview);
  }

  async updateReview(id: number, review: UpdateReviewDto) {
    const existingReview = await this.getReview(id);
    if (!existingReview) {
      throw new Error('Review not found');
    }
    const updatedReview = Object.assign(existingReview, review);
    return this.reviewsRepo.save(updatedReview);
  }

  async deleteReview(id: number) {
    const review = await this.getReview(id);
    if (!review) {
      throw new Error('Review not found');
    }
    await this.reviewsRepo.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
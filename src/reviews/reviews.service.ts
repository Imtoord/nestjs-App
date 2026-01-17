import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getReviews() {
    return await this.reviewsRepo.find({
      loadEagerRelations: false,
      relations: ['user', 'product'],
    });
  }

  async getReview(id: number) {
    const review = await this.reviewsRepo.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: ['user', 'product'],
    });
    console.log(review);
    if (!review) {
      throw new  NotFoundException('Review not found');
    }

    return review;
  }

  async addReview(review: CreateReviewDto, user: User, productId: number) {
    const product = await this.productsService.getProduct(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const newReview = this.reviewsRepo.create({
      ...review,
      user,
      product,
    });
    // save and send review added seccessfully
    await this.reviewsRepo.save(newReview);
    return { message: 'Review added successfully' };
  }

  async updateReview(id: number, review: UpdateReviewDto, user: JwtPayload) {
    const existingReview = await this.getReview(id);
    if (!existingReview) {
      throw new NotFoundException('Review not found');
    }
    if(existingReview.user.id !== user.id){
      throw new NotFoundException(' access denied, you are not the owner of this review');
    }
    const updatedReview = Object.assign(existingReview, review);
    return await this.reviewsRepo.save(updatedReview);
  }

  async deleteReview(id: number, user: JwtPayload) {
    const review = await this.getReview(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if(review.user.id !== user.id){
      throw new NotFoundException(' access denied, you are not the owner of this review');
    }
    await this.reviewsRepo.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
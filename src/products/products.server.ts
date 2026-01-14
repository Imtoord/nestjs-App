import { Injectable, NotFoundException } from '@nestjs/common';
import { createProductTdo } from './tdos/create-product.tdo';
import { updateProductTdo } from './tdos/update-product-tdo';
import { productQueryTdo } from './tdos/product-query.tdo';
import { Repository } from 'typeorm';
import { Product } from './prodect.entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/utils/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async getProducts(
    query?: productQueryTdo,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const qb = this.productsRepo.createQueryBuilder('product');

    if (query?.search) {
      qb.where(
        '(LOWER(product.title) LIKE :search OR LOWER(product.description) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    if (typeof query?.minPrice !== 'undefined') {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (typeof query?.maxPrice !== 'undefined') {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    if (query?.sort) {
      qb.orderBy('product.price', query.sort.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async createProduct(
    { title, description, price }: createProductTdo,
    currentUser: JwtPayload,
  ) {
    const product = {
      title,
      description: description.trim().toLowerCase(),
      price,
      user: currentUser,
    };

    return await this.productsRepo.save(product);
  }
  /**
   * getProduct
   * @param id
   * @returns
   */
  async getProduct(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**
   * updateProduct
   * @param id
   * @param body
   * @returns
   */

  async updateProduct(id: number, body: updateProductTdo) {
    const product = await this.productsRepo.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const updatedProduct = { ...product, ...body };
    await this.productsRepo.save(updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number) {
    const product = await this.productsRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepo.remove(product);
    return { message: 'Product deleted successfully' };
  }
}

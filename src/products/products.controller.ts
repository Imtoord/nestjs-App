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
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { createProductTdo } from './tdos/create-product.tdo';
import { updateProductTdo } from './tdos/update-product-tdo';
import { ProductsService } from './products.server';
import { productQueryTdo } from './tdos/product-query.tdo';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import type { JwtPayload } from 'src/utils/types';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  get(@Query(new ValidationPipe({ transform: true })) query?: productQueryTdo) {
    return this.productsService.getProducts(query);
  }

  @Post('')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  create(
    @Body() body: createProductTdo,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.productsService.createProduct(body, currentUser);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProduct(id);
  }

  @Put(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateProductTdo,
  ) {
    return this.productsService.updateProduct(id, body);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, AuthRolesGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}

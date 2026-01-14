import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ProductsModule,
     ReviewsModule, 
     UsersModule,
     TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV !== 'production',
        }
     },
       
     }),
      ConfigModule.forRoot({
        isGlobal:true,
        envFilePath:`.env.${process.env.NODE_ENV || 'development'}`,
      }),
    ],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass:ClassSerializerInterceptor 
      }
    ],
})
export class AppModule {}

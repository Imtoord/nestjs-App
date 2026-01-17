import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CURRENT_TIMESTAMP } from '../../utils/constants';
import { Review } from 'src/reviews/review.entity/review.entity';
import { User } from 'src/users/entity/user.entity';
import { agent } from 'supertest';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 300 })
  title: string;
  @Column()
  description: string;
  @Column({ type: 'float' , default: 0 })
  price: number;
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
  updatedAt: Date;
 @OneToMany(()=> Review, (review)=>review.product, {eager: true, onDelete: 'CASCADE'}) 
  reviews: Review[];
  @ManyToOne(() => User, (user) => user.products, {eager: true,  onDelete: 'CASCADE'})
  user: User
}

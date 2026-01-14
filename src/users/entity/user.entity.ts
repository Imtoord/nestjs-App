import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CURRENT_TIMESTAMP } from '../../utils/constants';
import { Product } from 'src/products/prodect.entity/product.entity';
import { Review } from 'src/reviews/review.entity/review.entity';
import { UserType } from 'src/utils/enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 150 })
  username: string;

  @Column({ unique: true, type: 'varchar', length: 200 })
  email: string;

  @Column({ unique: true })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.CUSTOMER })
  userType: UserType;

  @Column({ default: false })
  isAcconutVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}

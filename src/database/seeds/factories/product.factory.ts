import { Product } from '@entity/product';
import {Faker, faker} from '@faker-js/faker'
import { define } from 'typeorm-seeding';


define(Product, (faker:Faker) => {
  const product = new Product();
  product.sku = faker.random.numeric(5);
  product.name = faker.commerce.productName();
  return product;
})
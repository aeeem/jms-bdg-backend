import { Product } from "@entity/product";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";


export default class InitialDatabaseSeed implements Seeder{
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Product)().createMany(10);
  }
}
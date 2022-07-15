import { Product } from "@entity/product";
import { createConnection } from "typeorm";
import { makeRequest } from "../../helper/testHelper";

beforeAll(()=>{
    createConnection({
      type: "mysql",
      host: process.env.DATABASE_HOST!,
      port: Number(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
      entities: [
        Product,
        // __dirname + "/entity/*.ts",
        // __dirname + "/entity/*.js"
      ],
      synchronize: true,
      logging: false
    }).then(_con => {
      console.log("Connected to db!!");
    }).catch(console.error)
})

describe('Product', () => {
  it('GET /api/products', async () => {
    const response = await makeRequest.get('/api/products');
    expect(response.status).toBe(200);
  })
})
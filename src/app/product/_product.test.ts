import Database from "@database";
// import initialSeeds from "../../database/seeds/seeder/initialSeeds";
import { makeRequest } from "../../helper/testHelper";

describe('Product', () => {
  const db = new Database()
  beforeAll(async () => {
    await db.connectToDBTest()
    // await initialSeeds.productSeeder()
  })

  afterAll(async () => {
    await db.closeConnection()
  })
  
  test('GET /api/products', async () => {
    await makeRequest.get('/api/products')
    .expect(200)
    .then((res)=>{
      expect(res).toBe(200);
    });
  })
})
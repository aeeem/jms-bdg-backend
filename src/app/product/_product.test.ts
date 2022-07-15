import { makeRequest } from "../helper/testHelper";

describe('Product', () => {
  it('GET /api/products', async () => {
    const response = await makeRequest.get('/api/products');
    expect(response.status).toBe(200);
  })
})
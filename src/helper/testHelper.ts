import * as supertest from 'supertest'
import dotenv from 'dotenv'

dotenv.config( {} )
export const makeRequest = supertest.agent( process.env.TEST_URL )

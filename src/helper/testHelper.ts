import supertest from 'supertest'
import dotenv from 'dotenv'

dotenv.config( {} )

export const makeRequest = supertest( process.env.TEST_URL )

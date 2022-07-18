import app from '../app'
import supertest from 'supertest'

export const makeRequest = supertest(app)
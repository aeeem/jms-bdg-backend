/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from 'jsonwebtoken'

export const createToken = ( payload: object ) => {
  return jwt.sign( payload, process.env.JWT_SECRET!, { expiresIn: '12h' } )
}

export const verifyToken = ( token: string ) => {
  try {
    const decoded = jwt.verify( token, process.env.JWT_SECRET! )
    return decoded
  } catch ( error ) {
    return error
  }
}

export const decodeToken = ( token: string ) => {
  return jwt.decode( token )
}

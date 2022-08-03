import jwt from 'jsonwebtoken'

export const createToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export const verifyToken = (token: string) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) throw Error(err.message);
      return decoded;
    })
  } catch (error) {
    return error
  }
}

export const decodeToken = (token: string) => {
  return jwt.decode(token);
}
import bcrypt from 'bcrypt'

export const compareHash = async ( payload: string, encrypted: string ) => {
  try {
    const isMatch = await bcrypt.compare( payload, encrypted )
    return isMatch
  } catch ( err: any ) {
    return await Promise.reject( err.message )
  }
}

export const createHashPassword = async ( payload: string ) => {
  try {
    const salt = await bcrypt.genSalt( 10 )
    const hash = await bcrypt.hash( payload, salt )
    return hash
  } catch ( err: any ) {
    return err
  }
}

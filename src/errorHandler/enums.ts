export enum E_ErrorType {
  E_PRODUCT_NOT_FOUND           = "Product is Not Found",
  E_STOCK_NOT_FOUND             = "Stock is Not Found",
  E_DATABASE_ERROR              = 'E_DATABASE_ERROR',
  E_UNKNOWN_ERROR               = 'E_UNKNOWN_ERROR',
  E_NOT_FOUND                   = 'E_NOT_FOUND',
  E_UNAUTHORIZED                = 'E_UNAUTHORIZED',
  E_FORBIDDEN                   = 'E_FORBIDDEN',
  E_INTERNAL_SERVER_ERROR       = 'E_INTERNAL_SERVER_ERROR',
  E_BAD_REQUEST                 = 'E_BAD_REQUEST',
  ER_DUP_ENTRY                  = 'ER_DUP_ENTRY',
  E_PRODUCT_OR_VENDOR_NOT_FOUND = 'E_PRODUCT_OR_VENDOR_NOT_FOUND',
  E_VENDOR_NOT_FOUND            = 'Partai tidak ditemukan.',
  E_USER_EXISTS                 = 'User already exists',
  E_LOGIN_WRONG_PASSWORD        = 'Password salah!',
  E_LOGIN_WRONG_NIP             = 'No Induk tidak ditemukan',
  E_VALIDATION_ERROR            = 'E_VALIDATION_ERROR',
  E_USER_NOT_FOUND              = 'User not found',
  E_USER_IS_NOT_AUTHORIZED      = 'User is not authorized',

}

export enum HTTP_CODE {
  OK                    = 200,
  CREATED               = 201,
  ACCEPTED              = 202,
  NO_CONTENT            = 204,
  BAD_REQUEST           = 400,
  UNAUTHORIZED          = 401,
  FORBIDDEN             = 403,
  NOT_FOUND             = 404,
  INTERNAL_SERVER_ERROR = 500
}
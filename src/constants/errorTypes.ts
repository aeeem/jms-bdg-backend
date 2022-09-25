import { HTTP_CODE } from 'src/constants/enums'

export const E_ERROR = {
  CUSTOMER_NO_DEPOSIT           : { message: 'Pelanggan tidak memiliki deposit.', status: HTTP_CODE.OK },
  TRANSACTION_NOT_FOUND         : { message: 'Transaksi tidak ditemukan.', status: HTTP_CODE.NOT_FOUND },
  REGISTER_INVALID_PAYLOAD      : { message: 'Nip, password, nama tidak boleh kosong', status: HTTP_CODE.BAD_REQUEST },
  NO_TOKEN_PROVIDED             : { message: 'No token provided', status: HTTP_CODE.UNAUTHORIZED },
  NIP_AND_PASSWORD_REQUIRED     : { message: 'Nip dan password tidak boleh kosong', status: HTTP_CODE.BAD_REQUEST },
  FORBIDDEN_ROLE_INPUT          : { message: 'Pembuatan user dengan role super admin tidak diperbolehkan', status: HTTP_CODE.FORBIDDEN },
  ROLE_NOT_FOUND                : { message: 'Role tidak ditemukan', status: HTTP_CODE.NO_CONTENT },
  EMPLOYEE_NOT_FOUND            : { message: 'Pegawai tidak ditemukan', status: HTTP_CODE.NO_CONTENT },
  EXPECTED_TOTAL_PRICE_NOT_MATCH: { message: 'Total tidak sesuai', status: HTTP_CODE.FORBIDDEN },
  PRODUCT_NOT_FOUND             : { message: 'Product tidak ditemukan', status: HTTP_CODE.NO_CONTENT },
  STOCK_NOT_FOUND               : { message: 'Stock Tidak ditemukan', status: HTTP_CODE.NOT_FOUND },
  CUSTOMER_NOT_FOUND            : { message: 'Pelanggan Tidak ditemukan', status: HTTP_CODE.NO_CONTENT },
  DATABASE_ERROR                : { message: 'E_DATABASE_ERROR', status: HTTP_CODE.INTERNAL_SERVER_ERROR },
  UNKNOWN_ERROR                 : { message: 'E_UNKNOWN_ERROR', status: HTTP_CODE.INTERNAL_SERVER_ERROR },
  NOT_FOUND                     : { message: 'E_NOT_FOUND', status: HTTP_CODE.NO_CONTENT },
  UNAUTHORIZED                  : { message: 'E_UNAUTHORIZED', status: HTTP_CODE.UNAUTHORIZED },
  FORBIDDEN                     : { message: 'E_FORBIDDEN', status: HTTP_CODE.FORBIDDEN },
  INTERNAL_SERVER_ERROR         : { message: 'E_INTERNAL_SERVER_ERROR', status: HTTP_CODE.INTERNAL_SERVER_ERROR },
  BAD_REQUEST                   : { message: 'E_BAD_REQUEST', status: HTTP_CODE.BAD_REQUEST },
  _DUP_ENTRY                    : { message: 'ER_DUP_ENTRY', status: HTTP_CODE.BAD_REQUEST },
  PRODUCT_OR_VENDOR_NOT_FOUND   : { message: 'E_PRODUCT_OR_VENDOR_NOT_FOUND', status: HTTP_CODE.NO_CONTENT },
  VENDOR_NOT_FOUND              : { message: 'Partai tidak ditemukan.', status: HTTP_CODE.NO_CONTENT },
  USER_EXISTS                   : { message: 'User already exists', status: HTTP_CODE.BAD_REQUEST },
  LOGIN_WRONG_PASSWORD          : { message: 'Password salah!', status: HTTP_CODE.UNAUTHORIZED },
  LOGIN_WRONG_NIP               : { message: 'No Induk tidak ditemukan', status: HTTP_CODE.UNAUTHORIZED },
  VALIDATION_ERROR              : { message: 'E_VALIDATION_ERROR', status: HTTP_CODE.BAD_REQUEST },
  USER_NOT_FOUND                : { message: 'User not found', status: HTTP_CODE.NO_CONTENT },
  USER_IS_NOT_AUTHORIZED        : { message: 'User is not authorized', status: HTTP_CODE.UNAUTHORIZED },
  TOKEN_EXPIRED                 : { message: 'Token expired', status: HTTP_CODE.UNAUTHORIZED }
} as const

export type ErrorKeys = keyof typeof E_ERROR
export type ErrorMessages = typeof E_ERROR[keyof typeof E_ERROR]

export interface CustomErrorMessage {
  message: string
  status: number
}

export type ErrorTypes = ErrorMessages | Error | CustomErrorMessage

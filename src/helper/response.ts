export interface ResponseStatus {
  stat_code?: number
  stat_msg?: string
}

export interface ResponseType<T> extends ResponseStatus {
  data?: T
  // pagination: Pagination;
}

export interface ResponseTypePagination<T> extends ResponseStatus {
  data?: T
  page?: number
  totalData?: number
  limit?: number
  totalPage?: number
}
export interface ErrorResponseType<T> extends ResponseStatus {
  type?: T
  stack?: string
  details?: unknown
  // pagination: Pagination;
}


export const successWithPagination = <T = null> ( {
  data, page, totalData, limit, totalPage, stat_code = 200, stat_msg = ''
}: ResponseTypePagination<T> ): ResponseTypePagination<T> => {
  return {
 
    data,
    page,
    totalData,
    limit,
    totalPage,
    stat_code,
    stat_msg
  }
}
export const success = <T = null> ( {
  data, stat_code = 200, stat_msg = ''
}: ResponseType<T> ): ResponseType<T> => {
  return {
    data,
    stat_code,
    stat_msg
  }
}

export const error = <T = null> ( {
  type, stat_code = 400, stat_msg = '', stack
}: ErrorResponseType<T> ): ErrorResponseType<T> => {
  return {
    type,
    stat_code,
    stat_msg,
    stack
  }
}

export const OffsetFromPage = ( page: number, limit: number ) => {
  return ( page - 1 ) * limit
}

const makeResponse = {
  success,
  successWithPagination,
  error
}

export default makeResponse

export interface ResponseStatus {
  stat_code?: number;
  stat_msg?: string;
}
export interface ResponseType<T> extends ResponseStatus {
  data?: T;
  // pagination: Pagination;
}


export const success = <T = null>({ data, stat_code = 200, stat_msg = "" }: ResponseType<T>): ResponseType<T> => {

  return {
    data,
    stat_code,
    stat_msg
  }
}

export const error = <T = null>({ data, stat_code = 400, stat_msg = "" }: ResponseType<T>): ResponseType<T> => {

  return {
    data,
    stat_code,
    stat_msg
  }
}

const makeResponse = {
  success,
  error
}

export default makeResponse
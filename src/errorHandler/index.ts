export enum E_ErrorType {
  E_PRODUCT_NOT_FOUND           = "Product is Not Found",
  E_DATABASE_ERROR              = 'E_DATABASE_ERROR',
  E_UNKNOWN_ERROR               = 'E_UNKNOWN_ERROR',
  E_NOT_FOUND                   = 'E_NOT_FOUND',
  E_UNAUTHORIZED                = 'E_UNAUTHORIZED',
  E_FORBIDDEN                   = 'E_FORBIDDEN',
  E_INTERNAL_SERVER_ERROR       = 'E_INTERNAL_SERVER_ERROR',
  E_BAD_REQUEST                 = 'E_BAD_REQUEST',
  ER_DUP_ENTRY                  = 'ER_DUP_ENTRY',
  E_PRODUCT_OR_VENDOR_NOT_FOUND = 'E_PRODUCT_OR_VENDOR_NOT_FOUND',
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

export class ErrorHandler extends Error {
  private err: any;
  public type: E_ErrorType;
  public status: number;
  constructor(err: any){
    super()
    this.err = err;
    this.errorTypeParser()
  }

  errorTypeParser() {
    switch(this.err){
      case E_ErrorType.E_PRODUCT_NOT_FOUND:
        this.type     = E_ErrorType.E_NOT_FOUND;
        this.message  = E_ErrorType.E_PRODUCT_NOT_FOUND
        this.status   = HTTP_CODE.INTERNAL_SERVER_ERROR
        break;

      default:
        switch(this.err.name){
          case 'QueryFailedError':
            this.handleDatabaseError(this.err)
            break;
        }
        break;
    }
  }

  handleDatabaseError(name: any) {
    switch (name.code) {
      case E_ErrorType.ER_DUP_ENTRY:
        this.type     = E_ErrorType.ER_DUP_ENTRY;
        this.message  = this.err.message
        this.status   = HTTP_CODE.INTERNAL_SERVER_ERROR
      default:
        this.type     = E_ErrorType.E_UNKNOWN_ERROR;
        this.message  = this.err.message
        this.status   = HTTP_CODE.INTERNAL_SERVER_ERROR
        console.error(this.err.stack)
        break;
    }
  }
}
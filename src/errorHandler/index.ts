import { E_ErrorType, HTTP_CODE } from "./enums";


export class ErrorHandler extends Error {
  private err: any;
  public type: string;
  public status: number;
  constructor(err: any){
    super()
    this.err = err;
    this.errorTypeParser()
  }

  getEnumKeyByEnumValue<
    TEnumKey extends string,
    TEnumVal extends string | number
  >(myEnum: { [key in TEnumKey]: TEnumVal }, enumValue: TEnumVal): string {
    const keys = (Object.keys(myEnum) as TEnumKey[]).filter(
      (x) => myEnum[x] === enumValue,
    );
    return keys.length > 0 ? keys[0] : '';
  }

  errorTypeParser() {
    switch(this.err){
      case E_ErrorType.E_FORBIDDEN_ROLE_INPUT:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err);;
        this.message  = E_ErrorType.E_FORBIDDEN_ROLE_INPUT
        this.status   = HTTP_CODE.NOT_FOUND
        break;
      case E_ErrorType.E_ROLE_NOT_FOUND:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err);;
        this.message  = E_ErrorType.E_ROLE_NOT_FOUND
        this.status   = HTTP_CODE.NOT_FOUND
        break;
      case E_ErrorType.E_EMPLOYEE_NOT_FOUND:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err);;
        this.message  = E_ErrorType.E_EMPLOYEE_NOT_FOUND
        this.status   = HTTP_CODE.NOT_FOUND
        break;
      case E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err);
        this.message  = E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH
        this.status   = HTTP_CODE.BAD_REQUEST
        break;
      case E_ErrorType.E_PRODUCT_NOT_FOUND:
        this.type     = E_ErrorType.E_NOT_FOUND;
        this.message  = E_ErrorType.E_PRODUCT_NOT_FOUND
        this.status   = HTTP_CODE.INTERNAL_SERVER_ERROR
        break;

      case E_ErrorType.E_USER_EXISTS:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err);
        this.message  = E_ErrorType.E_USER_EXISTS
        this.status   = HTTP_CODE.INTERNAL_SERVER_ERROR
        break;

      case E_ErrorType.E_LOGIN_WRONG_PASSWORD:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err)
        this.message  = E_ErrorType.E_LOGIN_WRONG_PASSWORD
        this.status   = HTTP_CODE.UNAUTHORIZED
        break;
      
      case E_ErrorType.E_LOGIN_WRONG_NIP:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err)
        this.message  = E_ErrorType.E_LOGIN_WRONG_NIP
        this.status   = HTTP_CODE.UNAUTHORIZED
        break;
      
      case E_ErrorType.E_CUSTOMER_NOT_FOUND:
        this.type     = this.getEnumKeyByEnumValue(E_ErrorType, this.err)
        this.message  = E_ErrorType.E_CUSTOMER_NOT_FOUND
        this.status   = HTTP_CODE.INTERNAL_SERVER_ERROR
        break;

      case E_ErrorType.E_VENDOR_NOT_FOUND:
        this.type    = this.getEnumKeyByEnumValue(E_ErrorType, this.err)
        this.message = E_ErrorType.E_VENDOR_NOT_FOUND
        this.status  = HTTP_CODE.INTERNAL_SERVER_ERROR
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
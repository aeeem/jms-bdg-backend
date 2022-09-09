
// type ErrorCode = keyof typeof E_Error

// interface CustomErrorMessage {
//   message: string
//   status: number
// }

// type ErrorHandlerParam = ErrorCode | Error | CustomErrorMessage

// const isHandledError = ( code: string ): code is ErrorCode => {
//   return code as ErrorCode in E_Error
// }

// const isErrorInstance = ( err: Error ): err is Error => {
//   return err instanceof Error
// }

// const isCustomError = ( err: CustomErrorMessage ): err is CustomErrorMessage => {
//   return err !== undefined
// }

// const handler = ( err: ErrorHandlerParam ) => {
//   if ( isHandledError( err as string ) ) {
//     const code = err as keyof typeof E_Error
//     return E_Error[code]
//   } else if ( isErrorInstance( err as Error ) ) {
//     return err
//   } else if ( isCustomError( err as CustomErrorMessage ) ) {
//     return err
//   } else {
//     return { message: 'Something went wrong', status: 500 }
//   }
// }

// const valHandled = E_Error.E_FORBIDDEN
// const valErrInst = new Error( 'ini dari error instance' )
// const valCustomE = { message: 'ini dari custom error', status: 500 }

// console.log( handler( valHandled ) )
// console.log( handler( valErrInst ) )
// console.log( handler( valCustomE ) )

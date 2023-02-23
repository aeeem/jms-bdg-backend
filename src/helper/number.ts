export const padLeft = ( number: number, length: number, character: string = '0' ) => {
  let result = String( number )
  for ( let i = result.length; i < length; i++ ) {
    result = character + result
  }
  return result
}

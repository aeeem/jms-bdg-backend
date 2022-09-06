import { Scope } from '@entity/scopes'

interface scopeFormatType {
  [feature: string]: string[]
}

export const scopeFormatter = ( scopes: Scope ): scopeFormatType => {
  const exclude = [
    'id',
    'created_at',
    'updated_at'
  ]
  const scopeKeys = Object.keys( scopes ).filter( key => !exclude.includes( key ) )
  const sc: scopeFormatType = {}
  scopeKeys.forEach( scope => {
    const [action, feature] = scope.split( '_' )
    if ( !sc[feature] ) {
      sc[feature] = []
    }
    sc[feature].push( action )
  } )
  return sc
}

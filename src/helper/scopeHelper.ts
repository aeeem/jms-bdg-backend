import { Scope } from "@entity/scopes";

type scopeFormatType = {
  [feature: string]: string[]
}

export const scopeFormatter = (scopes: Scope):scopeFormatType => {
  const exclude = ['id','created_at','updated_at'];
  const scopeKeys = Object.keys(scopes).filter(key => !exclude.includes(key));
  let sc:scopeFormatType = {}
  scopeKeys.forEach(scope=> {
    const [action, feature] = scope.split('_');
    if(!sc[feature]){
      sc[feature] = []
    }
    sc[feature].push(action)
  })
  return sc
}

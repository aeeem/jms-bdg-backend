import app from '../../app'

export const getRoutes = async () => {
  return await new Promise<any[]>( ( resolve, reject ) => {
    try {
      let route: any
      const routes: any[] = []
      app._router.stack.forEach( ( middleware: any ) => {
        if ( middleware.route ) { // routes registered directly on the app
          routes.push( middleware.route )
        } else if ( middleware.name === 'router' ) { // router middleware
          middleware.handle.stack.forEach( ( handler: any ) => {
            route = handler.route
            route && routes.push( route )
          } )
        }
      } )
      resolve( routes )
    } catch ( e ) {
      reject( e )
    }
  } )
}

import {
  generateRoutes, generateSpec, ExtendedRoutesConfig, ExtendedSpecConfig
} from 'tsoa'

void ( async () => {
  const specOptions: ExtendedSpecConfig = {
    basePath                      : '/',
    entryFile                     : 'src/app.ts',
    noImplicitAdditionalProperties: 'throw-on-extras',
    controllerPathGlobs           : ['src/**/*.router.ts'],
    outputDirectory               : 'tsoa',
    specVersion                   : 3,
    securityDefinitions           : {
      // jwt: {
      //   type: "apiKey",
      //   name: "Authorization",
      //   in: "header",
        
      // },
      api_key: {
        type  : 'apiKey',
        name  : 'authorization',
        in    : 'header',
        flow  : 'implicit',
        scopes: {
          'write:pets': 'modify things',
          'read:pets' : 'read things'
        }
      }
      // tsoa_auth: {
      //   type: "oauth2",
      //   authorizationUrl: "http://swagger.io/api/oauth/dialog",
      //   flow: "implicit",
      //   scopes: {
      //       "write:pets": "modify things",
      //       "read:pets": "read things"
      //   }
      // }
    },
    spec: {
      securitydefinitions: {
        // jwt: {
        //   type: "apiKey",
        //   name: "Authorization",
        //   in: "header"
        // },
        api_key: {
          type  : 'apiKey',
          name  : 'access_token',
          in    : 'header',
          flow  : 'implicit',
          scopes: {
            'write:pets': 'modify things',
            'read:pets' : 'read things'
          }
        }
        // tsoa_auth: {
        //   type: "oauth2",
        //   authorizationUrl: "http://swagger.io/api/oauth/dialog",
        //   flow: "implicit",
        //   scopes: {
        //       "write:pets": "modify things",
        //       "read:pets": "read things"
        //   }
        // }
      }
    }
  }

  const routeOptions: ExtendedRoutesConfig = {
    middleware                    : 'express',
    basePath                      : '/',
    entryFile                     : 'src/app.ts',
    noImplicitAdditionalProperties: 'throw-on-extras',
    controllerPathGlobs           : ['src/**/*.router.ts'],
    routesDir                     : 'tsoa',
    authenticationModule          : 'src/auth.ts'
  }

  await generateSpec( specOptions )
  await generateRoutes( routeOptions )
} )()

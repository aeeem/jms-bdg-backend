import {generateRoutes, generateSpec, ExtendedRoutesConfig, ExtendedSpecConfig } from 'tsoa'

(async () => {
  const specOptions: ExtendedSpecConfig = {
    basePath: "/",
    entryFile: "src/app.ts",
    noImplicitAdditionalProperties: "throw-on-extras",
    controllerPathGlobs: ["src/**/*.router.ts"],
    outputDirectory: "tsoa",
    specVersion: 3,
    securityDefinitions:{
      access_token: {
        type: "apiKey",
        name: "access_token",
        in: "header",
        flow: "implicit",
        scopes: {
            "write:pets": "modify things",
            "read:pets": "read things"
        }
      }
    },
    spec:{
      securitydefinitions: {
        access_token: {
          type: "apiKey",
          name: "access_token",
          in: "query",
          flow: "implicit",
          scopes: {
              "write:pets": "modify things",
              "read:pets": "read things"
          }
        }
      }
    }
  };

  const routeOptions:ExtendedRoutesConfig = {
    middleware: "express",
    basePath: "/",
    entryFile: "src/app.ts",
    noImplicitAdditionalProperties: "throw-on-extras",
    controllerPathGlobs: ["src/**/*.router.ts"],
    routesDir: "tsoa",
    authenticationModule: "src/auth.ts",
  };

  await generateSpec(specOptions);
  await generateRoutes(routeOptions);
})();
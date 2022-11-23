"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
void (() => __awaiter(void 0, void 0, void 0, function* () {
    const specOptions = {
        basePath: '/',
        entryFile: 'src/app.ts',
        noImplicitAdditionalProperties: 'throw-on-extras',
        controllerPathGlobs: ['src/**/*.router.ts'],
        outputDirectory: 'tsoa',
        specVersion: 3,
        securityDefinitions: {
            // jwt: {
            //   type: "apiKey",
            //   name: "Authorization",
            //   in: "header",
            // },
            api_key: {
                type: 'apiKey',
                name: 'authorization',
                in: 'header',
                flow: 'implicit',
                scopes: {
                    'write:pets': 'modify things',
                    'read:pets': 'read things'
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
                    type: 'apiKey',
                    name: 'access_token',
                    in: 'header',
                    flow: 'implicit',
                    scopes: {
                        'write:pets': 'modify things',
                        'read:pets': 'read things'
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
    };
    const routeOptions = {
        middleware: 'express',
        basePath: '/',
        entryFile: 'src/app.ts',
        noImplicitAdditionalProperties: 'throw-on-extras',
        controllerPathGlobs: ['src/**/*.router.ts'],
        routesDir: 'tsoa',
        authenticationModule: 'src/auth.ts'
    };
    yield (0, tsoa_1.generateSpec)(specOptions);
    yield (0, tsoa_1.generateRoutes)(routeOptions);
}))();

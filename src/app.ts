import express, { Express } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'

import { RegisterRoutes } from '../tsoa/routes'
import Database from '@database'
import { ValidateError } from 'tsoa'
import { Errors } from './errorHandler'

const app: Express = express()

Sentry.init( {
  dsn         : 'https://b0d2c9476df95951d527e2520a663470@o4506620963454976.ingest.sentry.io/4506620982919168',
  integrations: [
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    // enable HTTP calls tracing
    new Sentry.Integrations.Http( { tracing: true } ),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express( { app } ),
    new ProfilingIntegration()
  ],
  // Performance Monitoring
  tracesSampleRate  : 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0
} )

if ( process.env.SENTRY_ENV === 'production' ) {
  // The request handler must be the first middleware on the app
  app.use( Sentry.Handlers.requestHandler() )

  // TracingHandler creates a trace for every incoming request
  app.use( Sentry.Handlers.tracingHandler() )
}

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/
export const db = new Database()
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on( 'ready', async () => {
  if ( process.env.NODE_ENV === 'test' ) {
    await db.connectToDBTest()
  } else {
    await db.connectToDB()
  }
} )
// Handle security and origin in production
if ( process.env.NODE_ENV === 'production' ) {
  app.use( helmet() )
  app.use( cors( { origin: 'https://jmsbdg.com' } ) )
  console.log( 'production' )
  console.log( process.env.DEV_DATABASE_NAME )
} else {
  app.use( cors( { origin: '*' } ) )
}

app.set( 'json spaces', 2 )
app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )

// Handle logs in console during development
if ( process.env.NODE_ENV === 'development' ) {
  app.use( morgan( 'dev' ) )
  app.use( '/docs', swaggerUi.serve, async ( req: express.Request, res: express.Response ) => {
    return res.send( swaggerUi.generateHTML( await import( '../tsoa/swagger.json' ) ) )
  } )
}

app.get( '/ping', ( req, res ) => {
  res.send( { msg: 'pong' } ).status( 200 )
} )
/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/

RegisterRoutes( app )

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/

if ( process.env.SENTRY_ENV === 'production' ) {
  app.use( Sentry.Handlers.errorHandler() )
}

app.use( ( err: unknown, req: express.Request, res: express.Response, next: express.NextFunction ) => {
  if ( err instanceof ValidateError ) {
    // console.error( `Caught Validation Error for ${req.path}:`, err.fields )
    const error = new Errors( err )
    return res.status( 422 ).send( error.response )
  }
  if ( err instanceof Errors ) {
    return res.status( err.response.stat_code ?? 500 ).json( { ...err.response } )
  }
  next()
} )

app.emit( 'ready' )
app.use( function notFoundHandler ( _req, res: express.Response ) {
  return res.status( 404 ).send( { message: 'Not Found' } )
} )

export default app

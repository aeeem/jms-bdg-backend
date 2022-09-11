const concurrently = require( 'concurrently' )

concurrently( [
  'yarn tsoa:generate_',
  'yarn start:test-server',
  'yarn wait-on tcp:8080 && yarn jest'
], {
  prefix      : 'name',
  killOthers  : ['failure', 'success'],
  restartTries: 0
} ).then(
  function onSuccess ( exitInfo ) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed successfully.
    process.exit()
  },
  function onFailure ( exitInfo ) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed because of a failure.
    process.exit()
  }
)

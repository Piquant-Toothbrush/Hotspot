var express = require('express');
var serverConfig =require('./server-config');
var Spot =require ('./db/Spots');
var User =require( './db/Users');
const test="test"
var facebookAuthConfig =require('./auth/fbAuth').facebookAuthConfig;
var localAuthConfig =require('./auth/localAuth');
var primaryRoutes =require('./routes/primaryRoutes');
var authRoutes =require('./routes/authRoutes');
var apiRoutes =require('./routes/apiRoutes');


const app = express();
const port = process.env.PORT || 8732;

console.log('User', User);
// Server and auth configuration
localAuthConfig(User);
facebookAuthConfig(User);
serverConfig(app, User);

// Render the main splash page upon arrival
primaryRoutes(app);

// Wire up routes for authentication
authRoutes(app);

// RESTFUL routes for retrieving data from the database
apiRoutes(app);

// start the server
app.listen(port, () => {
  console.log('server started on port');
});

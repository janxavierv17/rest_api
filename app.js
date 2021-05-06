'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const user = require('./routes/user')
const { sequelize, Sequelize } = require("./models")
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();


// setup morgan which gives us http request logging
app.use(morgan('dev'));
app.use(express.json());

// Ensures connection to the database exists.
(async () => {
  try {
    await sequelize.sync();
    console.log('Models are synchronized with the database!');

    await sequelize.authenticate();
    console.log('Connection to the database successful!');

  } catch (error) {
    console.log('Error connecting to the database: ', error);
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use("/api", user)

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

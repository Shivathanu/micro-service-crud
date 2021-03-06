const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const routes = require('./routes');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());
var swaggerUi = require("swagger-ui-express");
var apiDoc = require("./docs/index.js");

// start of test code -- Line 14 to 51 is commented, should be enabled for running the code locally
// var http = require("http");
// var server = http.createServer(app);
// /**
//  * Listen on provided port, on all network interfaces.
//  */
// var port = normalizePort(process.env.PORT || "3030");
// /**
//  * Normalize a port into a number, string, or false.
//  */
// function normalizePort(val) {
//     var port = parseInt(val, 10);

//     if (isNaN(port)) {
//         // named pipe
//         return val;
//     }

//     if (port >= 0) {
//         // port number
//         return port;
//     }

//     return false;
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */
// function onListening() {
//     var addr = server.address();
//     var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
//     console.log('Listening on ' + bind);
// }

// app.set("port", port);
// server.listen(port);
// server.on("listening", onListening);
// server.timeout = 240000;

// end of test code

app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiDoc));
app.use('/', routes);

module.exports = app;
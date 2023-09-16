const http = require("http");
const os = require("os");

console.log("Server starting...");

var handler = function (request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  console.log("Date is " + Date.now());
  response.writeHead(200);
  response.end("Date is " + Date.now() + "\n");
};

var www = http.createServer(handler);
www.listen(8080);

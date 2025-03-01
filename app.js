// Require module
const express = require("express");
const http = require("http");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const httpProxy = require("http-proxy");

// server setup,   express app object
const app = express();
const port = 3000;

// handling GET request
app.get("/", (req, res) => {
  res.send("Hello World, node app is running on this server");
  res.end();
});

// port number
const PORT = process.env.PORT || 5000;

// server setup
app.listen(PORT, console.log(`server started on port ${PORT}`));

// rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour",
});

// apply rate limit to all requests
app.use(limiter);

// logging middleware
app.use(morgan("combined"));

// define routes
app.get('/', (req, res) => {
    res.send('Welcome to gateway');
})
// create proxy to handle load balancing
const proxy = httpProxy.createProxyServer();

//load balancing setup
const service = [
  { target: "http://localhost:5001" },
  { target: "http://localhost:5002" },
  { target: "http://localhost:5003" },
];

// load balancing middleware
app.use("/service*", (req, res) => {
  const { url } = req;
  const selectedService = service[Math.floor(Math.randm() * service.length)];
  proxy.web(req, res, { target: selectedService.target + url });
});

// create separate instances for the backend services
http
  .createServer((req, res) => {
    res.end("Service 1 response");
  })
  .listen(5001, () => console.log("Service 1 running on port 5001"));

http
  .createServer((req, res) => {
    res.end("Service 1 response");
  })
  .listen(5002, () => console.log("Service 1 running on port 5001"));
 
http
  .createServer((req, res) => {
    res.end("Service 1 response");
  })
  .listen(5003, () => console.log("Service 1 running on port 5001"));

// start the gateway server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Gateway server started on port ${port}`);
})

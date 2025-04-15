// backend/server.js
require("dotenv").config(); // load .env variables if any
const http = require("http");
const app = require("./app");
//const connectDB = require("./config/db");

// Connect Database
//connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

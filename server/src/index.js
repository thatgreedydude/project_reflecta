const http = require("http");
const app = require("./app");
const initSocket = require("./socket/io");

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const { Server } = require("socket.io");
const registerHandlers = require("./handlers");

function initSocket(server) {
  const corsConfig = require("../config/cors");
    const io = new Server(server, {
    cors: corsConfig
  });

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    registerHandlers(io, socket);
  });
}

module.exports = initSocket;
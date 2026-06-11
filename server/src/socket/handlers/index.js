const registerRoomHandlers = require("./room.handler");
const registerChatHandlers = require("./chat.handler");

function registerHandlers(io, socket) {
  registerRoomHandlers(io, socket);
  registerChatHandlers(io, socket);
}

module.exports = registerHandlers;
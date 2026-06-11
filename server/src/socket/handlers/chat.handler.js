function registerChatHandlers(io, socket) {

  socket.on("send_message", (message) => {
    const roomCode = socket.roomCode;
    if (!roomCode) return;

    io.to(roomCode).emit("receive_message", {
      sender: socket.id,
      message
    });
  });

}

module.exports = registerChatHandlers;
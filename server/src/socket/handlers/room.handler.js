const generateRoomCode = require("../../utils/generateRoomCode");
const {
  createRoom,
  joinRoom,
  removePlayerFromRooms
} = require("../../game/room.service");

function registerRoomHandlers(io, socket) {

  socket.on("create_room", (callback) => {
    const code = generateRoomCode();

    const room = createRoom(code, socket.id);

    socket.join(code);
    socket.roomCode = code;

    callback({ success: true, roomCode: code, room });

    io.to(code).emit("room_update", room);
  });

  socket.on("join_room", (code, callback) => {
    const result = joinRoom(code, socket.id);

    if (result.error) {
      return callback({ success: false, message: result.error });
    }

    socket.join(code);
    socket.roomCode = code;

    callback({ success: true, roomCode: code });

    io.to(code).emit("room_update", result.room);
  });

  socket.on("leave_room", (callback) => {
    const code = socket.roomCode;
    if (!code) return;

    socket.leave(code);
    removePlayerFromRooms(socket.id);

    socket.roomCode = null;

    callback?.({ success: true });
  });

  socket.on("disconnect", () => {
    removePlayerFromRooms(socket.id);
  });
}

module.exports = registerRoomHandlers;
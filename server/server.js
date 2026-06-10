const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const path = require("path");

app.use(express.static(path.join(__dirname, "../client")));

// Allow frontend connections (we'll tighten this later in production)
app.use(cors());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory room storage
const rooms = {};

/**
 * Helper: generate room code
 */
function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("send_message", (message) => {
    const roomCode = socket.roomCode;
    if (!roomCode) return;

    const payload = {
        sender: socket.id,
        message
    };

    io.to(roomCode).emit("receive_message", payload);
  });

  /**
   * CREATE ROOM
   */
  socket.on("create_room", (callback) => {
    const roomCode = generateRoomCode();

    rooms[roomCode] = {
      players: [socket.id]
    };

    socket.roomCode = roomCode;
    socket.join(roomCode);

    console.log(`🏠 Room created: ${roomCode} by ${socket.id}`);

    callback({
      success: true,
      roomCode,
      playerId: socket.id
    });

    io.to(roomCode).emit("room_update", rooms[roomCode]);
  });

  /**
   * JOIN ROOM
   */
  socket.on("join_room", (roomCode, callback) => {
    const room = rooms[roomCode];

    if (!room) {
        return callback({ success: false, message: "Room does not exist" });
    }

    // 🧠 NEW: already inside room check
    if (room.players.includes(socket.id)) {
        socket.roomCode = roomCode;

        return callback({
        success: true,
        roomCode,
        message: "Already in room"
        });
    }

    // room full check
    if (room.players.length >= 2) {
        return callback({ success: false, message: "Room is full" });
    }

    room.players.push(socket.id);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    console.log(`🚪 ${socket.id} joined room ${roomCode}`);

    callback({
        success: true,
        roomCode
    });

    io.to(roomCode).emit("room_update", room);
  });

  /**
   * DISCONNECT HANDLING
   */
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);

    // remove player from any room
    for (const roomCode in rooms) {
      const room = rooms[roomCode];

      room.players = room.players.filter((id) => id !== socket.id);

      // if room empty → delete it
      if (room.players.length === 0) {
        delete rooms[roomCode];
      } else {
        io.to(roomCode).emit("room_update", room);
      }
    }
  });

  socket.on("leave_room", (callback) => {
    const roomCode = socket.roomCode;

    if (!roomCode) {
        return callback?.({
        success: false,
        message: "You are not in a room"
        });
    }

    const room = rooms[roomCode];

    if (!room) {
        socket.roomCode = null;
        return callback?.({
        success: false,
        message: "Room already deleted"
        });
    }

    room.players = room.players.filter((id) => id !== socket.id);

    socket.leave(roomCode);
    socket.roomCode = null;

    console.log(`🚪 ${socket.id} left room ${roomCode}`);

    if (room.players.length === 0) {
        delete rooms[roomCode];
        console.log(`🗑️ Room deleted: ${roomCode}`);
    } else {
        io.to(roomCode).emit("room_update", room);
    }

    callback?.({ success: true });
  });

});

// Health check route (important for hosting like Render)
app.get("/", (req, res) => {
  res.send("Reflecta v0.0.A1 Server Running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
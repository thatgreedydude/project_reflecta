const {
  getRoom,
  setRoom,
  deleteRoom
} = require("./room.store");

function createRoom(code, hostId) {
  const room = {
    code,
    players: [hostId]
  };

  setRoom(code, room);
  return room;
}

function joinRoom(code, playerId) {
  const room = getRoom(code);
  if (!room) return { error: "Room does not exist" };

  if (room.players.includes(playerId)) {
    return { room };
  }

  if (room.players.length >= 2) {
    return { error: "Room is full" };
  }

  room.players.push(playerId);

  return { room };
}

function removePlayerFromRooms(playerId) {
  const { rooms } = require("./room.store");

  for (const code in rooms) {
    const room = rooms[code];

    room.players = room.players.filter(id => id !== playerId);

    if (room.players.length === 0) {
      deleteRoom(code);
    }
  }
}

module.exports = {
  createRoom,
  joinRoom,
  removePlayerFromRooms
};
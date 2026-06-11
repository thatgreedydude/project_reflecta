const rooms = {};

function getRoom(code) {
  return rooms[code];
}

function setRoom(code, room) {
  rooms[code] = room;
}

function deleteRoom(code) {
  delete rooms[code];
}

function getAllRooms() {
  return rooms;
}

module.exports = {
  rooms,
  getRoom,
  setRoom,
  deleteRoom,
  getAllRooms
};
const logEl = document.getElementById("log");
const chatLog = document.getElementById("chatLog");

function log(msg) {
  logEl.textContent += msg + "\n";
  console.log(msg);
}

function chat(msg) {
  chatLog.textContent += msg + "\n";
}

// CONNECT TO SERVER
// const socket = io(); this is from a LAN tunnel test
// const socket = io(window.location.origin); this is for the first Render deploy without the url
const socket = io("https://reflecta-chfg.onrender.com"); // with the url

// receive messages
socket.on("receive_message", (data) => {
  chat(`${data.sender}: ${data.message}`);
});

// send message
document.getElementById("sendChatBtn").onclick = () => {
  const input = document.getElementById("chatInput");
  const message = input.value;

  if (!message) return;

  socket.emit("send_message", message);
  input.value = "";
};

socket.on("connect", () => {
  log("Connected to server: " + socket.id);
});

// ROOM UPDATE FROM SERVER
socket.on("room_update", (room) => {
  log("Room updated:");
  log(JSON.stringify(room, null, 2));
});

// CREATE ROOM
document.getElementById("createRoomBtn").onclick = () => {
  socket.emit("create_room", (response) => {
    if (response.success) {
      socket.roomCode = response.roomCode;
      log("Room created: " + response.roomCode);
    } else {
      log("Failed to create room");
    }
  });
};

// JOIN ROOM
document.getElementById("joinRoomBtn").onclick = () => {
  const code = document.getElementById("roomInput").value;

  socket.emit("join_room", code, (response) => {
    if (response.success) {
      socket.roomCode = response.roomCode;
      log("Joined room: " + response.roomCode);
    } else {
      log("Join failed: " + response.message);
    }
  });
};

// LEAVE ROOM
document.getElementById("leaveRoomBtn").onclick = () => {
  socket.emit("leave_room", (response) => {
    if (response.success) {
      log("Left room successfully");
      socket.roomCode = null;
    } else {
      log("Leave failed: " + response.message);
    }
  });
};
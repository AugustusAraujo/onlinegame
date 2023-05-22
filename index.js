import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("http://127.0.0.1:3000");

const playerSize = 15;
const playerColor = Math.floor(Math.random() * 16777215).toString(16);
const lastPosition = {
  x: 60,
  y: 135,
};
const maxHeight = 300 - playerSize;
const maxWidth = 585 - playerSize;
let players = [];

function init() {
  setSessionData();
  addEventListener("keypress", (e) => {
    if (e.key == "a") move("l");
    if (e.key == "d") move("r");
    if (e.key == "w") move("t");
    if (e.key == "s") move("b");
  });
}

function setSessionData() {
  setTimeout(() => {
    document.querySelector("#session").innerHTML = socket.id;
  }, 300);
}

function drawPlayer(x, y, color) {
  const canvas = document.getElementById("board");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = String("#" + color);
    ctx.fillRect(x, y, playerSize, playerSize);
  }
}

function deletePlayer(x, y) {
  const canvas = document.getElementById("board");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.clearRect(x, y, playerSize, playerSize);
  }
}

function move(direction) {
  // l, r, t, b
  switch (direction) {
    case "l":
      if (checkIfCanMove("l")) {
        deletePlayer(lastPosition.x, lastPosition.y);
        drawPlayer(lastPosition.x - playerSize, lastPosition.y, playerColor);
        lastPosition.x -= playerSize;
        sendPlayerPositionToServer();
      }
      break;
    case "r":
      if (checkIfCanMove("r")) {
        deletePlayer(lastPosition.x, lastPosition.y);
        drawPlayer(lastPosition.x + playerSize, lastPosition.y, playerColor);
        lastPosition.x += playerSize;
        sendPlayerPositionToServer();
      }
      break;
    case "t":
      if (checkIfCanMove("t")) {
        deletePlayer(lastPosition.x, lastPosition.y);
        drawPlayer(lastPosition.x, lastPosition.y - playerSize, playerColor);
        lastPosition.y -= playerSize;
        sendPlayerPositionToServer();
      }
      break;
    case "b":
      if (checkIfCanMove("b")) {
        deletePlayer(lastPosition.x, lastPosition.y);
        drawPlayer(lastPosition.x, lastPosition.y + playerSize, playerColor);
        lastPosition.y += playerSize;
        sendPlayerPositionToServer();
      }
      break;
  }
}

function checkIfCanMove(key) {
  if (lastPosition.y == 0 && key == "t") return false;
  if (lastPosition.y == maxHeight && key == "b") return false;
  if (lastPosition.x == 0 && key == "l") return false;
  if (lastPosition.x == maxWidth && key == "r") return false;
  return true;
}

function sendPlayerPositionToServer() {
  socket.emit(
    "receivePlayerData",
    JSON.stringify({
      id: socket.id,
      position: lastPosition,
      color: playerColor,
    })
  );
}

function updatePlayers(player) {
  console.log(player);
  player = JSON.parse(player);
  deletePlayer(player.lastPosition.x, player.lastPosition.y);
  drawPlayer(player.position.x, player.position.y, player.color);
}

function drawAll(data) {
  data = JSON.parse(data);
  data.map((i) => {
    drawPlayer(i.position.x, i.position.y, i.color);
  });
}

socket.on("newPlayersLocations", (data) => {
  console.log(data);
  updatePlayers(data);
});

socket.on("players", (data) => {
  players = data;
  drawAll(data);
});

init();

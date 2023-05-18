const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let players = [];

io.on("connection", (socket) => {
  console.log("New player connected:", socket.id);
  players.push({
    id: socket.id,
    position: {
      x: 0,
      y: 0,
    },
  });
  socket.on("receivePlayerData", (data) => {
    console.log(players);
    let { id, position } = JSON.parse(data);
    io.emit(
      "newPlayersLocations",
      JSON.stringify({
        id,
        position,
      })
    );
  });
});

httpServer.listen(3000);

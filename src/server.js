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
    let { id, position, color } = JSON.parse(data);

    players.map((i) => {
      if (i.id == id) {
        i.lastPosition = i.position;
        i.position = position;
      }
    });

    let player = players.filter((i) => i.id == id);
    player[0].color = color;

    io.emit("newPlayersLocations", JSON.stringify(player[0]));
  });
});

httpServer.listen(3000);

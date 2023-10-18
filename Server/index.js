const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);
const PORT = 3001;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const roomClickCounts = {};
const players = [];
let currentPlayerIndex = -1;
const roomUsers = {};
const playerStatus = {};
const PlayerChance = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("storeUserName", (data) => {
    PlayerChance.push({ id: socket.id, username: data });
  });

  socket.on("join_room", (data, username) => {

    if (roomUsers[data] >= 2) {
      socket.emit("room_full", true);
    } else {
      socket.join(data);
  
      if (!roomClickCounts[data]) {
        roomClickCounts[data] = 0;
      }
      
      const matchingPlayers = players.filter(
        (player) => player.room.data !== data
      );
  
      if (matchingPlayers.length === 0) {
        players.push({ id: socket.id, room: { data, username } });
      }
  
      const activeuser = {
        active: true,
      };
 
      io.to(players[0].id).emit("active_player", activeuser);
  
      console.log(`User with ID: ${socket.id} joined room: ${data}`);  
      if (!roomUsers[data]) {
        roomUsers[data] = 1;
      } else {
        roomUsers[data]++;
      }
  
      io.to(data).emit("user_count", roomUsers[data]);
      io.to(data).emit("room_id", data);
  
      playerStatus[socket.id] = "online";
      io.emit("player_status", playerStatus);
      socket.emit("room_full", false);

      const activeUsers = players
    .filter((player) => player.room.data === data)
    .map((player) => player.room.username);
  io.to(data).emit("active_users", activeUsers);

  
    }
  });
  

  socket.on("send_message", (data) => {
    const currentPlayerIndex = players.findIndex(
      (player) => player.id === socket.id
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayer = players[nextPlayerIndex];
    io.to(data.room).emit("player_name", nextPlayer.room.username);
    io.to(data.room).emit("win_player", data.author)
    socket.to(nextPlayer.id).emit("enable_button", data);
    io.to(data.room).emit("total_click_count", roomClickCounts[data.room]++);
  });

  socket.on("winner", (data) => {
    console.log("winnerData", data);
    io.to(data.room).emit("player_winner", data);
  });

  socket.on("winner_score",(data)=>{
    console.log(data)
    const currentPlayerIndex = players.findIndex(
      (player) => player.id === socket.id
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayer = players[nextPlayerIndex];
    var score = data.score + 1
    var scoreUser={
      score:score+1,
      name:data.winner
    }
   io.to(data.room).emit("score",scoreUser)
  })

  // socket.on("disconnect", () => {
  //   console.log("User Disconnected", socket.id);
  //   const index = players.findIndex((player) => player.id === socket.id);
  //   if (index !== -1) {
  //     players.splice(index, 1);
  //   }
  //   for (const room in roomUsers) {
  //     if (socket.rooms.has(room)) {
  //       roomUsers[room]--;
  //       io.to(room).emit("user_count", roomUsers[room]);
  //       break;
  //     }
  //   }

  //   playerStatus[socket.id] = "offline";
  //   io.emit("player_status", playerStatus);
  // });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    const index = players.findIndex((player) => player.id === socket.id);
    if (index !== -1) {
      
      const disconnectedUser = players.splice(index, 1)[0];
      io.to(disconnectedUser.room.data).emit("active_users", getActiveUsers(disconnectedUser.room.data));

      if (getActiveUsers(disconnectedUser.room.data).length === 0) {
        // Clear the room ID
        delete roomClickCounts[disconnectedUser.room.data];
        // Inform all clients in the room that the room is available
        io.to(disconnectedUser.room.data).emit("room_available");
      }
    }
    
    for (const room in roomUsers) {
      if (socket.rooms.has(room)) {
        roomUsers[room]--;
        io.to(room).emit("user_count", roomUsers[room]);
        break;
      }
    }
  
    playerStatus[socket.id] = "offline";
    io.emit("player_status", playerStatus);
  });
  
  function getActiveUsers(room) {
    return players
      .filter((player) => player.room.data === room)
      .map((player) => player.room.username);
  }



});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

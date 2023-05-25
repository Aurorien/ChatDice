const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

// Mongoose
const mongoose = require("mongoose");
const diceOutcomeModel = require("./models");

const start = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dicegame");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();

app.use(express.static("public"));

// Endpoint för att visa meddelanden från mongoDB
app.get("/dicehistory", async (req, res) => {
  try {
    const allDiceOutcomes = await diceOutcomeModel.find();
    return res.status(200).json(allDiceOutcomes);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

io.on("connection", (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`);

  socket.on("chatMessage", (msg) => {
    console.log("Meddelanden: " + msg.message);
    let today = new Date();
    let dateTime = today.toISOString().replace("T", " ").slice(0, 21);
    io.emit("newChatMessage", {
      date: dateTime,
      user: msg.user,
      message: msg.message,
      hex: msg.hex,
    });
  });

  socket.on("diceGame", (msg) => {
    io.emit("newDiceTurn", {
      message: `${msg.user} : Tärningen landade på: ${msg.dice_value}  \xa0\xa0\xa0\xa0  \r\n Total poäng för ${msg.user}: ${msg.total_dice_value}`,
      hex: msg.hex,
    });

    let user = msg.user;
    let diceValue = msg.dice_value;
    let totalDiceValue = msg.total_dice_value;
    let today = new Date();
    let dateTime = today.toISOString().replace("T", " ").slice(0, 21);

    // Sparar till MongoDB med Mongoose
    const newDiceThrow = new diceOutcomeModel({
      date: dateTime,
      user: user,
      dice_value: diceValue,
      total_dice_value: totalDiceValue,
    });
    console.log("newDiceThrow.date", newDiceThrow.date);

    newDiceThrow.save();
  });
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

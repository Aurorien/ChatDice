const socket = io();

const formUser = document.querySelector("#formUser");
const inputUser = document.querySelector("#inputUser");
const messages = document.querySelector("#messages");
const formMessage = document.querySelector("#formMessage");
const inputMessage = document.querySelector("#inputMessage");
const greeting = document.querySelector("#greeting");
const diceButton = document.querySelector("#dice-button");
const diceturn = document.querySelector("#diceturn");

let myUser, randDice;
let totDice = 0;
let hexCode = "inget";

// Generates a random hex code for coloring text
function generateRandomHexCode() {
  const x = Math.floor(Math.random() * 10).toString(10);
  const y = Math.floor(Math.random() * 10).toString(10);
  const i = Math.floor(Math.random() * 10).toString(10);

  const hexCode = `#00${y}${y}${i}${i}`;

  // const hexCode = `#${x}${x}${y}${y}${i}${i}`;

  return hexCode;
}

formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  greeting.innerHTML = "<h1>Välkommen " + myUser + "</h1>";
  document.getElementById("user").style.display = "none";
  document.getElementById("message").style.display = "block";
  document.getElementById("flex-container").style.display = "flex";
  hexCode = generateRandomHexCode();
});

// Chat
formMessage.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("hexCode", hexCode);

  if (inputMessage.value) {
    socket.emit("chatMessage", {
      user: myUser,
      message: inputMessage.value,
      hex: hexCode,
    });
    inputMessage.value = "";
  }
});

socket.on("newChatMessage", function (msg) {
  console.log("msg newChatMessage", msg);
  let liChat = document.createElement("li");
  liChat.classList.add("li-chat");

  let divChatDate = document.createElement("div");
  divChatDate.classList.add("chat-date");
  liChat.appendChild(divChatDate);
  divChatDate.textContent = msg.date + "\xa0\xa0";

  let spanChatUser = document.createElement("span");
  liChat.appendChild(spanChatUser);
  spanChatUser.textContent = msg.user + ": ";
  spanChatUser.style.color = msg.hex;

  let spanChatMsg = document.createElement("span");
  // spanChatMsg.classList.add("chat-message");
  spanChatUser.appendChild(spanChatMsg);
  spanChatMsg.textContent = msg.message;

  messages.appendChild(liChat);
});

// Dicegame
diceButton.addEventListener("click", (e) => {
  e.preventDefault();
  randDice = Math.floor(Math.random() * 6 + 1);
  totDice += randDice;
  console.log("randDice", randDice);
  console.log("totDice", totDice);
  console.log("myUser", myUser);

  socket.emit("diceGame", {
    user: myUser,
    dice_value: randDice,
    total_dice_value: totDice,
  });
});

socket.on("newDiceTurn", function (msg) {
  console.log("msg newDicwTurn", msg);
  let liDice = document.createElement("li");
  liDice.textContent = msg;
  diceturn.appendChild(liDice);
});

const socket = io();

const formUser = document.querySelector("#formUser");
const inputUser = document.querySelector("#inputUser");
const inputUserBtn = document.querySelector("#inputUserBtn");
const usernameError = document.querySelector("#username-error");
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
  let x, y, i;

  // To kind of get a good variation and vibrancy of colors
  x = Math.floor(Math.random() * 10).toString(10);
  if (x === "0") {
    y = Math.floor(Math.random() * (10 - 5) + 5).toString(10);
  } else {
    y = Math.floor(Math.random() * 3).toString(10);
  }
  if (y || x === "0") {
    i = Math.floor(Math.random() * (10 - 5) + 5).toString(10);
  } else {
    i = "0";
  }

  const hexCode = `#${x}${x}${y}${y}${i}${i}`;

  return hexCode;
}

// Regex (regular expression) test and rule on input username to prevent database injections

// inputUser.addEventListener("input", function () {
//   let username = inputUser.value;
//   const regex = /^[A-Za-z0-9]+$/;
//   console.log("username", username);

//   if (username.length > 0 && !regex.test(username)) {
//     console.log("REGEX");

//     usernameError.style.display = "block";
//     inputUserBtn.disabled = true;
//   } else if (username === "") {
//     console.log("ELSEIF");
//     usernameError.style.display = "none";
//     inputUserBtn.disabled = true;
//   } else {
//     console.log("ELSE");
//     usernameError.style.display = "none";
//     inputUserBtn.disabled = false;
//   }
// });

inputUser.addEventListener("input", () =>
  regex(inputUser.value, usernameError, inputUserBtn)
);

function regex(textinput, errorElement, button) {
  let text = textinput;
  const regex = /^[A-Za-z0-9(),?!"*.,\-:]+$/;
  console.log("text", text);

  if (text.length > 0 && !regex.test(text)) {
    console.log("REGEX");
    errorElement.style.display = "block";
    button.disabled = true;
  } else if (text === "") {
    console.log("ELSEIF");
    errorElement.style.display = "none";
    button.disabled = true;
  } else {
    console.log("ELSE");
    errorElement.style.display = "none";
    button.disabled = false;
  }
}

formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  greeting.textContent = `Välkommen ${myUser}`;
  document.getElementById("user").style.display = "none";
  document.getElementById("message").style.display = "block";
  document.getElementById("flex-container").style.display = "flex";
  hexCode = generateRandomHexCode();
});

// isUsernameValid() {
//   const regex = /^[A-Za-z0-9]+$/
//   return regex.test(this.username)
// }

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
    hex: hexCode,
  });
});

socket.on("newDiceTurn", function (msg) {
  console.log("msg newDicwTurn", msg);
  let liDice = document.createElement("li");
  liDice.textContent = msg.message;
  diceturn.appendChild(liDice);
  liDice.style.color = msg.hex;
});

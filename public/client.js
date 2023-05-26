const socket = io();

const formUser = document.querySelector("#form-user");
const inputUser = document.querySelector("#input-user");
const inputUserBtn = document.querySelector("#input-user-btn");
const usernameError = document.querySelector("#username-error");
const messages = document.querySelector("#messages");
const formMessage = document.querySelector("#form-message");
const inputMessage = document.querySelector("#input-message");
const inputMessageBtn = document.querySelector("#input-message-btn");
const messageError = document.querySelector("#message-error");
const greeting = document.querySelector("#greeting");
const diceButton = document.querySelector("#dice-button");
const diceturn = document.querySelector("#diceturn");
const diceHistorySec = document.querySelector("#dicehistory-sec");
const diceHistoryContainer = document.querySelector("#dicehistory-container");
const diceHistoryShow = document.querySelector("#dicehistory-show");
const diceHistoryHide = document.querySelector("#dicehistory-hide");

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

// Regex (regular expression) test and permissions on input, to prevent injections in database
function regex(textinput, errorElement, button) {
  let text = textinput;
  const regex = /^[A-Za-z0-9(),?!"*^.,_=~\-:ÅÄÖåäö\s]+$/;
  console.log("text", text);
  if (text.length > 0 && !regex.test(text)) {
    console.log("REGEX");
    errorElement.innerHTML =
      '<div class="invalid-feedback"> Endast bokstäver, siffror och följande tecken: ()?!"=*_^.,-: ~ </div>';

    button.disabled = true;
  } else if (text === "") {
    console.log("ELSEIF");
    errorElement.innerHTML = "";
    button.disabled = true;
  } else {
    console.log("ELSE");
    errorElement.innerHTML = "";
    button.disabled = false;
  }
}

// User start
inputUser.addEventListener("input", () =>
  regex(inputUser.value, usernameError, inputUserBtn)
);

formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  greeting.textContent = `Välkommen ${myUser}`;
  document.getElementById("user").style.display = "none";
  document.getElementById("message").style.display = "block";
  document.getElementById("flex-container").style.display = "flex";
  diceHistorySec.style.display = "block";
  hexCode = generateRandomHexCode();
  inputUser.value = "";
  inputUserBtn.disabled = true;
});

// Chat
inputMessage.addEventListener("input", () =>
  regex(inputMessage.value, messageError, inputMessageBtn)
);

formMessage.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("hexCode", hexCode);

  if (inputMessage.value) {
    socket.emit("chatMessage", {
      user: myUser,
      message: inputMessage.value,
      hex: hexCode,
    });
  }
  inputMessage.value = "";
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
  spanChatUser.appendChild(spanChatMsg);
  spanChatMsg.textContent = msg.message;

  messages.insertBefore(liChat, messages.firstChild);
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
  diceturn.insertBefore(liDice, diceturn.firstChild);
  liDice.style.color = msg.hex;
});

window.onload = inputMessage.value = "";

// Dice history
diceHistoryShow.addEventListener("click", (e) => {
  e.preventDefault();
  diceHistoryShow.style.display = "none";
  diceHistoryHide.style.display = "block";
  diceHistoryContainer.style.display = "block";
  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }

  const ul = document.getElementById("dicehistory");
  const url = "http://localhost:3000/dicehistory";

  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data);
      let message = data.reverse();
      return message.map(function (data) {
        let li = createNode("li");
        li.textContent = `${data.date}\xa0\xa0\xa0 ${data.user} :\xa0\xa0Kastpoäng: ${data.dice_value}\xa0\xa0\xa0Total poäng: ${data.total_dice_value}`;
        append(ul, li);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

diceHistoryHide.addEventListener("click", (e) => {
  e.preventDefault();
  diceHistoryShow.style.display = "block";
  diceHistoryHide.style.display = "none";
  diceHistoryContainer.style.display = "none";
});
